import { Router } from 'express';
import db from '../db/init.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// 获取政策列表
router.get('/', (req, res) => {
  const { 
    city, 
    category, 
    keyword, 
    isRealData,
    page = 1, 
    pageSize = 20,
    sort = 'created_at'
  } = req.query;

  let where = [];
  let params = [];

  if (city) {
    where.push('city = ?');
    params.push(city);
  }

  if (category) {
    where.push('category = ?');
    params.push(category);
  }

  if (keyword) {
    where.push('(title LIKE ? OR description LIKE ? OR tags LIKE ?)');
    const kw = `%${keyword}%`;
    params.push(kw, kw, kw);
  }

  if (isRealData !== undefined) {
    where.push('is_real_data = ?');
    params.push(isRealData === 'true' ? 1 : 0);
  }

  const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';
  
  const total = db.prepare(`SELECT COUNT(*) as count FROM policies ${whereSql}`).get(...params).count;
  
  const offset = (page - 1) * pageSize;
  const policies = db.prepare(`
    SELECT * FROM policies 
    ${whereSql}
    ORDER BY ${sort} DESC
    LIMIT ? OFFSET ?
  `).all(...params, Number(pageSize), offset);

  const formattedPolicies = policies.map(p => ({
    ...p,
    isRealData: p.is_real_data === 1,
    categoryName: p.category_name,
    validUntil: p.valid_until,
    dataSource: p.data_source,
    lastVerifiedAt: p.last_verified_at,
    eligibility: p.eligibility ? JSON.parse(p.eligibility) : [],
    applicationProcess: p.application_process ? JSON.parse(p.application_process) : [],
    materials: p.materials ? JSON.parse(p.materials) : [],
    tags: p.tags ? JSON.parse(p.tags) : [],
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  }));

  res.json({
    data: formattedPolicies,
    total,
    page: Number(page),
    pageSize: Number(pageSize),
    totalPages: Math.ceil(total / pageSize)
  });
});

// 获取政策详情
router.get('/:id', (req, res) => {
  const policy = db.prepare('SELECT * FROM policies WHERE id = ?').get(req.params.id);
  
  if (!policy) {
    return res.status(404).json({ message: '政策不存在' });
  }

  const formattedPolicy = {
    ...policy,
    isRealData: policy.is_real_data === 1,
    categoryName: policy.category_name,
    validUntil: policy.valid_until,
    dataSource: policy.data_source,
    lastVerifiedAt: policy.last_verified_at,
    eligibility: policy.eligibility ? JSON.parse(policy.eligibility) : [],
    applicationProcess: policy.application_process ? JSON.parse(policy.application_process) : [],
    materials: policy.materials ? JSON.parse(policy.materials) : [],
    tags: policy.tags ? JSON.parse(policy.tags) : [],
    createdAt: policy.created_at,
    updatedAt: policy.updated_at,
  };

  res.json({ data: formattedPolicy });
});

// 获取所有城市列表
router.get('/meta/cities', (req, res) => {
  const cities = db.prepare('SELECT DISTINCT city, province FROM policies ORDER BY province, city').all();
  
  const provinceMap = {};
  cities.forEach(c => {
    if (!provinceMap[c.province]) {
      provinceMap[c.province] = [];
    }
    provinceMap[c.province].push(c.city);
  });

  res.json({ data: provinceMap });
});

// 获取所有分类
router.get('/meta/categories', (req, res) => {
  const categories = db.prepare('SELECT DISTINCT category, category_name FROM policies ORDER BY category').all();
  res.json({ 
    data: categories.map(c => ({ 
      value: c.category, 
      label: c.category_name 
    })) 
  });
});

// 管理端：新增政策
router.post('/', authMiddleware, (req, res) => {
  const {
    id, title, city, province, category, categoryName,
    subsidyAmount, description, eligibility, applicationProcess,
    materials, officialLink, difficulty, validUntil, tags,
    isRealData, dataSource, lastVerifiedAt, status
  } = req.body;

  if (!id || !title || !city || !province || !category) {
    return res.status(400).json({ message: '缺少必要字段' });
  }

  const existing = db.prepare('SELECT id FROM policies WHERE id = ?').get(id);
  if (existing) {
    return res.status(400).json({ message: '政策ID已存在' });
  }

  db.prepare(`
    INSERT INTO policies (
      id, title, city, province, category, category_name,
      subsidy_amount, description, eligibility, application_process,
      materials, official_link, difficulty, valid_until, tags,
      is_real_data, data_source, last_verified_at, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, title, city, province, category, categoryName,
    subsidyAmount, description,
    JSON.stringify(eligibility || []),
    JSON.stringify(applicationProcess || []),
    JSON.stringify(materials || []),
    officialLink, difficulty || 'medium', validUntil,
    JSON.stringify(tags || []),
    isRealData ? 1 : 0, dataSource, lastVerifiedAt, status || 'active'
  );

  res.json({ message: '创建成功' });
});

// 管理端：更新政策
router.put('/:id', authMiddleware, (req, res) => {
  const {
    title, city, province, category, categoryName,
    subsidyAmount, description, eligibility, applicationProcess,
    materials, officialLink, difficulty, validUntil, tags,
    isRealData, dataSource, lastVerifiedAt, status
  } = req.body;

  const existing = db.prepare('SELECT id FROM policies WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: '政策不存在' });
  }

  db.prepare(`
    UPDATE policies SET
      title = COALESCE(?, title),
      city = COALESCE(?, city),
      province = COALESCE(?, province),
      category = COALESCE(?, category),
      category_name = COALESCE(?, category_name),
      subsidy_amount = COALESCE(?, subsidy_amount),
      description = COALESCE(?, description),
      eligibility = COALESCE(?, eligibility),
      application_process = COALESCE(?, application_process),
      materials = COALESCE(?, materials),
      official_link = COALESCE(?, official_link),
      difficulty = COALESCE(?, difficulty),
      valid_until = COALESCE(?, valid_until),
      tags = COALESCE(?, tags),
      is_real_data = COALESCE(?, is_real_data),
      data_source = COALESCE(?, data_source),
      last_verified_at = COALESCE(?, last_verified_at),
      status = COALESCE(?, status),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    title, city, province, category, categoryName,
    subsidyAmount, description,
    eligibility ? JSON.stringify(eligibility) : null,
    applicationProcess ? JSON.stringify(applicationProcess) : null,
    materials ? JSON.stringify(materials) : null,
    officialLink, difficulty, validUntil,
    tags ? JSON.stringify(tags) : null,
    isRealData !== undefined ? (isRealData ? 1 : 0) : null,
    dataSource, lastVerifiedAt, status,
    req.params.id
  );

  res.json({ message: '更新成功' });
});

// 管理端：删除政策
router.delete('/:id', authMiddleware, (req, res) => {
  const result = db.prepare('DELETE FROM policies WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ message: '政策不存在' });
  }
  res.json({ message: '删除成功' });
});

export default router;
