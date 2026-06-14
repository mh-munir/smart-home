import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const SETTINGS_PATH = path.join(process.cwd(), "data", "site-settings.json");
const PUBLIC_DIR = path.join(process.cwd(), "public");

function parseDataUrl(dataUrl) {
  const match = typeof dataUrl === "string" && dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) return null;
  return { mime: match[1], base64: match[2] };
}

export async function GET() {
  try {
    const raw = fs.readFileSync(SETTINGS_PATH, "utf8");
    const settings = JSON.parse(raw);
    return NextResponse.json(settings);
  } catch (err) {
    const fallback = { subtitle: "Make your home smarter", logo: "/logo.png", favicon: "/favicon.ico" };
    return NextResponse.json(fallback);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { subtitle = "", logoBase64, faviconBase64 } = body || {};

    // Load existing settings if present
    let existing = {};
    try {
      existing = JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8"));
    } catch (e) {
      existing = {};
    }

    const newSettings = { ...existing, subtitle: subtitle || existing.subtitle || "" };

    // Ensure public dir exists
    try {
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    } catch (e) {}

    if (logoBase64) {
      const parsed = parseDataUrl(logoBase64);
      let ext = "png";
      let buffer;
      if (parsed) {
        ext = parsed.mime.split("/")[1] || "png";
        if (ext === "jpeg") ext = "jpg";
        buffer = Buffer.from(parsed.base64, "base64");
      } else {
        buffer = Buffer.from(logoBase64, "base64");
      }

      const logoFilename = `logo.${ext}`;
      fs.writeFileSync(path.join(PUBLIC_DIR, logoFilename), buffer);
      newSettings.logo = `/${logoFilename}`;
    }

    if (faviconBase64) {
      const parsed = parseDataUrl(faviconBase64);
      let ext = "ico";
      let buffer;
      if (parsed) {
        ext = parsed.mime.split("/")[1] || "ico";
        if (ext === "jpeg") ext = "jpg";
        buffer = Buffer.from(parsed.base64, "base64");
      } else {
        buffer = Buffer.from(faviconBase64, "base64");
      }

      const favFilename = `favicon.${ext}`;
      fs.writeFileSync(path.join(PUBLIC_DIR, favFilename), buffer);
      newSettings.favicon = `/${favFilename}`;
    }

    // Persist settings file
    try {
      fs.mkdirSync(path.dirname(SETTINGS_PATH), { recursive: true });
      fs.writeFileSync(SETTINGS_PATH, JSON.stringify(newSettings, null, 2), "utf8");
    } catch (e) {
      console.error("Failed writing settings file:", e);
    }

    return NextResponse.json({ success: true, settings: newSettings });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
