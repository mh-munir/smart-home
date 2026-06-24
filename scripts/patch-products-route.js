import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'app', 'api', 'products', 'route.js');
if (!fs.existsSync(filePath)) {
  console.error('route.js not found at', filePath);
  process.exit(1);
}
let src = fs.readFileSync(filePath, 'utf8');

const createStart = src.indexOf('const product = await Product.create({');
if (createStart === -1) {
  console.error('create block not found');
  process.exit(1);
}
const afterCreateClose = src.indexOf('});', createStart);
if (afterCreateClose === -1) {
  console.error('create close not found');
  process.exit(1);
}
const insertPos = afterCreateClose + 3; // position after '});'
const insertText = `\n\n    // Ensure deal fields persisted\n    try {\n      await Product.updateOne({ _id: product._id }, { $set: { dealType: data.dealType || null, offer: data.offer || null, bestDeal: !!data.bestDeal } });\n    } catch (e) {\n      console.warn('Failed to persist deal fields for product', product._id, e);\n    }\n\n`;

if (src.indexOf('Ensure deal fields persisted') !== -1) {
  console.log('Patch already applied, skipping.');
  process.exit(0);
}

src = src.slice(0, insertPos) + insertText + src.slice(insertPos);
fs.writeFileSync(filePath, src, 'utf8');
console.log('Patched app/api/products/route.js — inserted persistence for deal fields.');
