import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db/init.js';
import { generateToken, authMiddleware } from '../middleware/auth.js';
import { sendWelcomeNotification } from '../utils/pushService.js';

const router = Router();

// 注册
router.post('/register', (req, res) => {
  const { username, email, password, nickname } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: '用户名、邮箱和密码不能为空' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: '密码长度不能少于6位' });
  }

  const existingUser = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email);
  if (existingUser) {
    return res.status(400).json({ message: '用户名或邮箱已被注册' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const result = db.prepare(`
    INSERT INTO users (username, email, password, nickname)
    VALUES (?, ?, ?, ?)
  `).run(username, email, hashedPassword, nickname || username);

  const user = db.prepare('SELECT id, username, email, nickname, avatar, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
  const token = generateToken(user);

  // 发送欢迎通知
  sendWelcomeNotification(user.id);

  res.json({
    message: '注册成功',
    token,
    user
  });
});

// 登录
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: '用户名和密码不能为空' });
  }

  const user = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?').get(username, username);
  if (!user) {
    return res.status(401).json({ message: '用户名或密码错误' });
  }

  const isValid = bcrypt.compareSync(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: '用户名或密码错误' });
  }

  const { password: _, ...safeUser } = user;
  const token = generateToken(safeUser);

  res.json({
    message: '登录成功',
    token,
    user: safeUser
  });
});

// 获取当前用户信息
router.get('/me', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT id, username, email, nickname, avatar, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ message: '用户不存在' });
  }
  res.json({ user });
});

// 更新用户信息
router.put('/me', authMiddleware, (req, res) => {
  const { nickname, avatar } = req.body;
  
  db.prepare(`
    UPDATE users 
    SET nickname = COALESCE(?, nickname), 
        avatar = COALESCE(?, avatar),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(nickname, avatar, req.user.id);

  const user = db.prepare('SELECT id, username, email, nickname, avatar, created_at FROM users WHERE id = ?').get(req.user.id);
  res.json({ message: '更新成功', user });
});

// 修改密码
router.put('/password', authMiddleware, (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: '旧密码和新密码不能为空' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: '新密码长度不能少于6位' });
  }

  const user = db.prepare('SELECT password FROM users WHERE id = ?').get(req.user.id);
  const isValid = bcrypt.compareSync(oldPassword, user.password);
  
  if (!isValid) {
    return res.status(401).json({ message: '旧密码错误' });
  }

  const hashedPassword = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(hashedPassword, req.user.id);

  res.json({ message: '密码修改成功' });
});

export default router;
