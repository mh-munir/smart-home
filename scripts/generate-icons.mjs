import fs from "fs";
import path from "path";
import zlib from "zlib";

const dir = path.join("public", "icons");
fs.mkdirSync(dir, { recursive: true });

/**
 * Create a minimal valid PNG with a solid-color rounded-rect background
 * and white "SH" text approximated as a block (no canvas needed).
 */
function createPNG(size, bgR, bgG, bgB) {
  const cornerRadius = Math.round(size * 0.125);

  // Build raw RGBA pixel rows
  const pixels = Buffer.alloc(size * size * 4);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      // Check if pixel is inside the rounded rectangle
      const inRect =
        x >= cornerRadius &&
        x < size - cornerRadius &&
        y >= cornerRadius &&
        y < size - cornerRadius;

      // Check corners
      const inTopLeft =
        x < cornerRadius && y < cornerRadius
          ? Math.hypot(x - cornerRadius, y - cornerRadius) <= cornerRadius
          : false;
      const inTopRight =
        x >= size - cornerRadius && y < cornerRadius
          ? Math.hypot(x - (size - cornerRadius - 1), y - cornerRadius) <= cornerRadius
          : false;
      const inBottomLeft =
        x < cornerRadius && y >= size - cornerRadius
          ? Math.hypot(x - cornerRadius, y - (size - cornerRadius - 1)) <= cornerRadius
          : false;
      const inBottomRight =
        x >= size - cornerRadius && y >= size - cornerRadius
          ? Math.hypot(x - (size - cornerRadius - 1), y - (size - cornerRadius - 1)) <= cornerRadius
          : false;

      if (inRect || inTopLeft || inTopRight || inBottomLeft || inBottomRight) {
        // Inside rounded rect – draw "SH" text as blocks
        const cx = size / 2;
        const cy = size / 2;
        const charW = size * 0.22;
        const charH = size * 0.38;
        const gap = size * 0.06;
        const thickness = size * 0.07;

        // "S" block (approximate)
        const sLeft = cx - charW - gap / 2;
        const sRight = cx - gap / 2;
        const sTop = cy - charH / 2;
        const sBottom = cy + charH / 2;

        // "H" block (approximate)
        const hLeft = cx + gap / 2;
        const hRight = cx + gap / 2 + charW;
        const hTop = cy - charH / 2;
        const hBottom = cy + charH / 2;

        let isText = false;

        // S: top bar
        if (y >= sTop && y < sTop + thickness && x >= sLeft && x < sRight) isText = true;
        // S: left vertical (top half)
        if (x >= sLeft && x < sLeft + thickness && y >= sTop && y < cy) isText = true;
        // S: middle bar
        if (y >= cy - thickness / 2 && y < cy + thickness / 2 && x >= sLeft && x < sRight) isText = true;
        // S: right vertical (bottom half)
        if (x >= sRight - thickness && x < sRight && y >= cy && y < sBottom) isText = true;
        // S: bottom bar
        if (y >= sBottom - thickness && y < sBottom && x >= sLeft && x < sRight) isText = true;

        // H: left vertical
        if (x >= hLeft && x < hLeft + thickness && y >= hTop && y < hBottom) isText = true;
        // H: right vertical
        if (x >= hRight - thickness && x < hRight && y >= hTop && y < hBottom) isText = true;
        // H: middle bar
        if (y >= cy - thickness / 2 && y < cy + thickness / 2 && x >= hLeft && x < hRight) isText = true;

        if (isText) {
          pixels[idx] = 255;
          pixels[idx + 1] = 255;
          pixels[idx + 2] = 255;
          pixels[idx + 3] = 255;
        } else {
          pixels[idx] = bgR;
          pixels[idx + 1] = bgG;
          pixels[idx + 2] = bgB;
          pixels[idx + 3] = 255;
        }
      } else {
        // Outside – transparent
        pixels[idx] = 0;
        pixels[idx + 1] = 0;
        pixels[idx + 2] = 0;
        pixels[idx + 3] = 0;
      }
    }
  }

  // Build PNG file
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const typeBuffer = Buffer.from(type);
    const crcData = Buffer.concat([typeBuffer, data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(crcData));
    return Buffer.concat([len, typeBuffer, data, crc]);
  }

  // CRC32
  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let j = 0; j < 8; j++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // IDAT – prepend filter byte (0) to each row
  const rawRows = Buffer.alloc(size * (1 + size * 4));
  for (let y = 0; y < size; y++) {
    rawRows[y * (1 + size * 4)] = 0; // filter: none
    pixels.copy(rawRows, y * (1 + size * 4) + 1, y * size * 4, (y + 1) * size * 4);
  }
  const compressed = zlib.deflateSync(rawRows);

  // IEND
  const iend = Buffer.alloc(0);

  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", compressed),
    chunk("IEND", iend),
  ]);
}

// Teal color: #0d9488 = rgb(13, 148, 136)
const png192 = createPNG(192, 13, 148, 136);
const png512 = createPNG(512, 13, 148, 136);

fs.writeFileSync(path.join(dir, "icon-192.png"), png192);
fs.writeFileSync(path.join(dir, "icon-512.png"), png512);

// Clean up SVG files
try { fs.unlinkSync(path.join(dir, "icon-192.svg")); } catch {}
try { fs.unlinkSync(path.join(dir, "icon-512.svg")); } catch {}

console.log("PNG icons created in public/icons/");