import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', '..', 'data.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// 读取政策数据
const policiesPath = path.join(__dirname, '..', '..', 'data', 'policies.json');
const policies = JSON.parse(readFileSync(policiesPath, 'utf-8'));

const insertPolicy = db.prepare(`
  INSERT OR REPLACE INTO policies (
    id, title, city, province, category, category_name,
    subsidy_amount, description, eligibility, application_process,
    materials, official_link, difficulty, valid_until, tags,
    is_real_data, data_source, last_verified_at, status
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let realCount = 0;

const insertMany = db.transaction((policyList) => {
  for (const p of policyList) {
    insertPolicy.run(
      p.id,
      p.title,
      p.city,
      p.province,
      p.category,
      p.categoryName,
      p.subsidyAmount,
      p.description,
      JSON.stringify(p.eligibility || []),
      JSON.stringify(p.applicationProcess || []),
      JSON.stringify(p.materials || []),
      p.officialLink || null,
      p.difficulty,
      p.validUntil,
      JSON.stringify(p.tags || []),
      p.isRealData ? 1 : 0,
      p.dataSource || null,
      p.lastVerifiedAt || null,
      p.status || 'active'
    );
    if (p.isRealData) realCount++;
  }
});

insertMany(policies);

console.log('');
console.log('✅ 政策数据导入完成');
console.log(`📊 总政策数: ${policies.length}`);
console.log(`✅ 真实政策数: ${realCount}`);
console.log(`📝 示例政策数: ${policies.length - realCount}`);
console.log('');

process.exit(0);
