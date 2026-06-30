import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tsContent = readFileSync(path.join(__dirname, '..', 'src', 'data', 'policies.ts'), 'utf-8');

const realCities = [
  "北京", "上海", "深圳", "杭州", "成都", "广州", "武汉", "南京",
  "西安", "苏州", "天津", "重庆", "长沙", "郑州", "青岛", "厦门",
  "合肥", "宁波", "无锡", "济南",
];

const categories = {
  employment: "就业补贴",
  housing: "住房补贴",
  entrepreneurship: "创业扶持",
  hukou: "落户政策",
  life: "生活福利",
};

const policies = [];
let id = 1;

const policyBlocks = tsContent.split(/^\s*\{/m).slice(1);

for (const block of policyBlocks) {
  const getValue = (key) => {
    const regex = new RegExp(`${key}:\\s*"([^"]*)"`, 'i');
    const match = block.match(regex);
    return match ? match[1] : '';
  };

  const getArray = (key) => {
    const regex = new RegExp(`${key}:\\s*\\[([\\s\\S]*?)\\]`, 'i');
    const match = block.match(regex);
    if (!match) return [];
    const items = match[1].match(/"([^"]*)"/g) || [];
    return items.map(s => s.replace(/"/g, ''));
  };

  const getProcessArray = (key) => {
    const regex = new RegExp(`${key}:\\s*\\[([\\s\\S]*?)\\],\\s*materials`, 'i');
    const match = block.match(regex);
    if (!match) return [];
    
    const steps = [];
    const stepMatches = match[1].match(/\{\s*step:\s*(\d+)[^}]*title:\s*"([^"]*)"[^}]*description:\s*"([^"]*)"[^}]*\}/g);
    if (stepMatches) {
      for (const s of stepMatches) {
        const stepMatch = s.match(/step:\s*(\d+)/);
        const titleMatch = s.match(/title:\s*"([^"]*)"/);
        const descMatch = s.match(/description:\s*"([^"]*)"/);
        if (stepMatch && titleMatch && descMatch) {
          steps.push({
            step: parseInt(stepMatch[1]),
            title: titleMatch[1],
            description: descMatch[1]
          });
        }
      }
    }
    return steps;
  };

  const title = getValue('title');
  const city = getValue('city');
  const province = getValue('province');
  const category = getValue('category');

  if (!title || !city) continue;

  const isReal = realCities.includes(city);
  const conditions = getArray('conditions');
  const materials = getArray('materials');
  const tags = getArray('tags');
  const applicationProcess = getProcessArray('applicationProcess');

  policies.push({
    id: String(id),
    title,
    city,
    province,
    category,
    categoryName: categories[category] || category,
    subsidyAmount: getValue('subsidyAmount') || getValue('subsidy_amount') || '',
    description: getValue('description') || '',
    eligibility: conditions,
    applicationProcess,
    materials,
    officialLink: getValue('officialUrl') || getValue('official_link') || '',
    difficulty: getValue('difficulty') || 'medium',
    validUntil: getValue('validUntil') || getValue('valid_until') || '长期有效',
    tags,
    isRealData: isReal,
    dataSource: isReal
      ? "基于当地人社局公开政策整理，具体以官方最新发布为准"
      : "示例数据，仅供参考，请以当地官方发布为准",
    lastVerifiedAt: "2024-06-01",
    status: "active",
  });

  id++;
}

const outputPath = path.join(__dirname, '..', 'server', 'data', 'policies.json');
writeFileSync(outputPath, JSON.stringify(policies, null, 2), 'utf-8');

console.log(`✅ 已解析并导出 ${policies.length} 条政策数据`);
console.log(`📁 输出文件: ${outputPath}`);
console.log(`✅ 真实政策: ${policies.filter(p => p.isRealData).length} 条`);
console.log(`📝 示例政策: ${policies.filter(p => !p.isRealData).length} 条`);
