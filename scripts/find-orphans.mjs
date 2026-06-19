import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const EXTS = ['.js', '.jsx', '.ts', '.tsx'];
const IGNORE_DIRS = new Set(['node_modules', '.next', 'out', 'build', 'public', '.git']);
const COMMON_SKIP_NAMES = new Set(['page', 'layout', 'loading', 'globals', 'styles', 'index']);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    if (IGNORE_DIRS.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      files.push(...walk(full));
    } else if (e.isFile()) {
      if (EXTS.includes(path.extname(e.name))) files.push(full);
    }
  }
  return files;
}

function readAllFiles(paths) {
  const map = new Map();
  for (const p of paths) map.set(p, fs.readFileSync(p, 'utf8'));
  return map;
}

const allFiles = walk(ROOT);
const fileContents = readAllFiles(allFiles);

const candidates = [];

for (const file of allFiles) {
  const rel = path.relative(ROOT, file).replaceAll('\\\\', '/');
  // Skip obvious framework entry files (Next.js pages and layouts)
  if (rel.startsWith('app/') && (rel.endsWith('/page.tsx') || rel.endsWith('/page.jsx') || rel.endsWith('/layout.tsx') || rel.endsWith('/layout.jsx') || rel.endsWith('/loading.tsx') || rel.endsWith('/loading.jsx'))) continue;

  const name = path.basename(file, path.extname(file));
  if (COMMON_SKIP_NAMES.has(name)) continue;

  // Skip files in scripts; user-run scripts are okay to be standalone
  if (rel.startsWith('scripts/')) continue;

  // Read occurrences of the basename across all files
  let count = 0;
  for (const [p, content] of fileContents.entries()) {
    if (p === file) continue;
    if (content.includes(name)) count++;
    if (count > 0) break; // one occurrence outside this file is enough
  }

  if (count === 0) {
    candidates.push(rel);
  }
}

console.log('Likely unused file candidates (heuristic):');
if (candidates.length === 0) {
  console.log('  (none found by heuristic)');
} else {
  for (const c of candidates) console.log('  -', c);
}
console.log('\nNotes: This is a heuristic. Review carefully before deleting. Files used only by Next routing or dynamic imports may be flagged.');
