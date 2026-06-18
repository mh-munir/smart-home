#!/usr/bin/env node
import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { saveBufferToStorage } from '../lib/storage.js';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');

function getMimeFromExt(ext) {
  const m = ext.toLowerCase();
  if (m === '.png') return 'image/png';
  if (m === '.jpg' || m === '.jpeg') return 'image/jpeg';
  if (m === '.gif') return 'image/gif';
  if (m === '.webp') return 'image/webp';
  if (m === '.svg') return 'image/svg+xml';
  if (m === '.ico') return 'image/x-icon';
  return 'application/octet-stream';
}

async function collectFiles(dir) {
  const out = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        out.push(...(await collectFiles(full)));
      } else if (e.isFile()) {
        out.push(full);
      }
    }
  } catch {
    // ignore
  }
  return out;
}

async function main() {
  if (!process.env.S3_BUCKET) {
    console.error('S3_BUCKET not set in env. Aborting.');
    process.exit(2);
  }

  console.log('Collecting files under', UPLOADS_DIR);
  const files = await collectFiles(UPLOADS_DIR);
  if (!files.length) {
    console.log('No files found to migrate.');
    process.exit(0);
  }

  const mapping = {};
  for (const f of files) {
    const rel = path.relative(PUBLIC_DIR, f).replace(/\\/g, '/');
    const ext = path.extname(f) || '';
    const mime = getMimeFromExt(ext);
    const buffer = await fs.readFile(f);
    try {
      const res = await saveBufferToStorage(buffer, rel, mime);
      mapping[`/${rel}`] = res.url;
      console.log(`Uploaded ${rel} -> ${res.url}`);
    } catch (err) {
      console.error(`Failed uploading ${rel}:`, err?.message || err);
    }
  }

  const outPath = path.join(process.cwd(), 'data', 'uploads-to-s3-map.json');
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(mapping, null, 2), 'utf8');
  console.log('Wrote mapping to', outPath);
  console.log('NOTE: This script does NOT update DB entries. Use the mapping to update blog image URLs or settings manually or via a separate script.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
