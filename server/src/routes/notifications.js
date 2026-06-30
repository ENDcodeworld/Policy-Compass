import { Router } from 'express';
import db from '../db/init.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// 获取通知列表
router.get('/', authMiddleware, (req, res) => {
  const { page = 1, pageSize = 20, unreadOnly } = req.query;

  let where = 'user_id = ?';
  let params = [req.user.id];

  if (unreadOnly === 'true') {
    where += ' AND is_read = 0';
  }

  const total = db.prepare(`SELECT COUNT(*) as count FROM notifications WHERE ${where}`).get(...params).count;

  const offset = (page - 1) * pageSize;
  const notifications = db.prepare(`
    SELECT * FROM notifications
    WHERE ${where}
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `).all(...params, Number(pageSize), offset);

  const unreadCount = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0')
    .get(req.user.id).count;

  res.json({
    data: notifications.map(n => ({
      ...n,
      isRead: n.is_read === 1,
      relatedPolicyId: n.related_policy_id,
      createdAt: n.created_at,
    })),
    total,
    unreadCount,
    page: Number(page),
    pageSize: Number(pageSize),
  });
});

// 获取未读数量
router.get('/unread-count', authMiddleware, (req, res) => {
  const count = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0')
    .get(req.user.id).count;
  
  res.json({ count });
});

// 标记为已读
router.put('/:id/read', authMiddleware, (req, res) => {
  const result = db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?')
    .run(req.params.id, req.user.id);
  
  if (result.changes === 0) {
    return res.status(404).json({ message: '通知不存在' });
  }
  
  res.json({ message: '已标记为已读' });
});

// 全部标记为已读
router.put('/read-all', authMiddleware, (req, res) => {
  db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0')
    .run(req.user.id);
  
  res.json({ message: '已全部标记为已读' });
});

// 删除通知
router.delete('/:id', authMiddleware, (req, res) => {
  const result = db.prepare('DELETE FROM notifications WHERE id = ? AND user_id = ?')
    .run(req.params.id, req.user.id);
  
  if (result.changes === 0) {
    return res.status(404).json({ message: '通知不存在' });
  }
  
  res.json({ message: '删除成功' });
});

// 发送通知（内部函数，供其他模块调用）
export const sendNotification = (userId, title, content, type = 'info', relatedPolicyId = null) => {
  db.prepare(`
    INSERT INTO notifications (user_id, title, content, type, related_policy_id)
    VALUES (?, ?, ?, ?, ?)
  `).run(userId, title, content, type, relatedPolicyId);
};

// 广播通知（给所有订阅用户发通知）
export const broadcastToSubscribers = (type, target, title, content, relatedPolicyId = null) => {
  const subscribers = db.prepare(`
    SELECT DISTINCT user_id FROM subscriptions
    WHERE type = ? AND target = ?
  `).all(type, target);

  subscribers.forEach(sub => {
    sendNotification(sub.user_id, title, content, 'policy', relatedPolicyId);
  });

  return subscribers.length;
};

export default router;
