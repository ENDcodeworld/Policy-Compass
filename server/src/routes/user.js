import { Router } from 'express';
import db from '../db/init.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// ========== 收藏相关 ==========

// 获取收藏列表
router.get('/favorites', authMiddleware, (req, res) => {
  const favorites = db.prepare(`
    SELECT f.*, p.title, p.city, p.category, p.category_name as categoryName, p.subsidy_amount as subsidyAmount
    FROM favorites f
    LEFT JOIN policies p ON f.policy_id = p.id
    WHERE f.user_id = ?
    ORDER BY f.created_at DESC
  `).all(req.user.id);

  res.json({ data: favorites });
});

// 添加收藏
router.post('/favorites', authMiddleware, (req, res) => {
  const { policyId } = req.body;
  
  if (!policyId) {
    return res.status(400).json({ message: '政策ID不能为空' });
  }

  try {
    db.prepare('INSERT INTO favorites (user_id, policy_id) VALUES (?, ?)').run(req.user.id, policyId);
    res.json({ message: '收藏成功' });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(400).json({ message: '已经收藏过了' });
    }
    throw err;
  }
});

// 取消收藏
router.delete('/favorites/:policyId', authMiddleware, (req, res) => {
  const result = db.prepare('DELETE FROM favorites WHERE user_id = ? AND policy_id = ?')
    .run(req.user.id, req.params.policyId);
  
  if (result.changes === 0) {
    return res.status(404).json({ message: '未收藏该政策' });
  }
  
  res.json({ message: '已取消收藏' });
});

// 检查是否已收藏
router.get('/favorites/:policyId/check', authMiddleware, (req, res) => {
  const fav = db.prepare('SELECT id FROM favorites WHERE user_id = ? AND policy_id = ?')
    .get(req.user.id, req.params.policyId);
  
  res.json({ isFavorite: !!fav });
});

// ========== 申请进度相关 ==========

// 获取申请列表
router.get('/applications', authMiddleware, (req, res) => {
  const applications = db.prepare(`
    SELECT * FROM applications
    WHERE user_id = ?
    ORDER BY updated_at DESC
  `).all(req.user.id);

  res.json({ 
    data: applications.map(a => ({
      ...a,
      policyName: a.policy_name,
      subsidyAmount: a.subsidy_amount,
      createdAt: a.created_at,
      updatedAt: a.updated_at,
    }))
  });
});

// 新增申请
router.post('/applications', authMiddleware, (req, res) => {
  const {
    policyId, policyName, city, province,
    subsidyAmount, status = 'saved', notes, deadline
  } = req.body;

  if (!policyId || !policyName) {
    return res.status(400).json({ message: '政策ID和名称不能为空' });
  }

  const result = db.prepare(`
    INSERT INTO applications (
      user_id, policy_id, policy_name, city, province,
      subsidy_amount, status, notes, deadline
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    req.user.id, policyId, policyName, city, province,
    subsidyAmount, status, notes, deadline
  );

  res.json({ message: '添加成功', id: result.lastInsertRowid });
});

// 更新申请
router.put('/applications/:id', authMiddleware, (req, res) => {
  const { status, notes, deadline } = req.body;

  const app = db.prepare('SELECT id FROM applications WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.user.id);
  
  if (!app) {
    return res.status(404).json({ message: '申请记录不存在' });
  }

  db.prepare(`
    UPDATE applications SET
      status = COALESCE(?, status),
      notes = COALESCE(?, notes),
      deadline = COALESCE(?, deadline),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
  `).run(status, notes, deadline, req.params.id, req.user.id);

  res.json({ message: '更新成功' });
});

// 删除申请
router.delete('/applications/:id', authMiddleware, (req, res) => {
  const result = db.prepare('DELETE FROM applications WHERE id = ? AND user_id = ?')
    .run(req.params.id, req.user.id);
  
  if (result.changes === 0) {
    return res.status(404).json({ message: '申请记录不存在' });
  }
  
  res.json({ message: '删除成功' });
});

// ========== 订阅相关 ==========

// 获取订阅列表
router.get('/subscriptions', authMiddleware, (req, res) => {
  const subscriptions = db.prepare(`
    SELECT * FROM subscriptions
    WHERE user_id = ?
    ORDER BY created_at DESC
  `).all(req.user.id);

  res.json({ data: subscriptions });
});

// 添加订阅
router.post('/subscriptions', authMiddleware, (req, res) => {
  const { type, target } = req.body;

  if (!type || !target) {
    return res.status(400).json({ message: '订阅类型和目标不能为空' });
  }

  try {
    db.prepare('INSERT INTO subscriptions (user_id, type, target) VALUES (?, ?, ?)')
      .run(req.user.id, type, target);
    res.json({ message: '订阅成功' });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(400).json({ message: '已经订阅过了' });
    }
    throw err;
  }
});

// 取消订阅
router.delete('/subscriptions', authMiddleware, (req, res) => {
  const { type, target } = req.body;

  const result = db.prepare('DELETE FROM subscriptions WHERE user_id = ? AND type = ? AND target = ?')
    .run(req.user.id, type, target);
  
  if (result.changes === 0) {
    return res.status(404).json({ message: '未订阅该内容' });
  }
  
  res.json({ message: '已取消订阅' });
});

// 检查是否已订阅
router.get('/subscriptions/check', authMiddleware, (req, res) => {
  const { type, target } = req.query;
  
  const sub = db.prepare('SELECT id FROM subscriptions WHERE user_id = ? AND type = ? AND target = ?')
    .get(req.user.id, type, target);
  
  res.json({ isSubscribed: !!sub });
});

export default router;
