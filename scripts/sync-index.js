import { readdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '../public/data/processed');

// 读取所有文件夹（排除文件）
const dirs = readdirSync(dataDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
  .sort(); // 按字母序排列（即日期升序）

// 写入索引文件
writeFileSync(
  join(dataDir, 'history_index.json'),
  JSON.stringify(dirs, null, 2) + '\n'
);

console.log(`✅ 已同步 ${dirs.length} 个日期: ${dirs.join(', ')}`);
