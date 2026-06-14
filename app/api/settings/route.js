import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin-session";
import { saveBufferToStorage } from "@/lib/storage";

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
  // Protect POST: require valid admin session cookie
  try {
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get(ADMIN_SESSION_COOKIE);
    const token = tokenCookie && tokenCookie.value ? tokenCookie.value : null;
    const session = token ? verifySessionToken(token) : null;
    if (!session) {
      return NextResponse.json({ success: false, error: "not_authorized" }, { status: 401 });
    }
  } catch (e) {
    return NextResponse.json({ success: false, error: "not_authorized" }, { status: 401 });
  }

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
      let mime = "image/png";
      if (parsed) {
        mime = parsed.mime;
        ext = parsed.mime.split("/")[1] || "png";
        if (ext === "jpeg") ext = "jpg";
        buffer = Buffer.from(parsed.base64, "base64");
      } else {
        buffer = Buffer.from(logoBase64, "base64");
      }

      const logoFilename = `logo.${ext}`;
      try {
        const res = await saveBufferToStorage(buffer, logoFilename, mime);
        newSettings.logo = res.url;
      } catch (e) {
        // Fallback to local write
        fs.writeFileSync(path.join(PUBLIC_DIR, logoFilename), buffer);
        newSettings.logo = `/${logoFilename}`;
      }
    }

    if (faviconBase64) {
      const parsed = parseDataUrl(faviconBase64);
      let ext = "ico";
      let buffer;
      let mime = "image/x-icon";
      if (parsed) {
        mime = parsed.mime;
        ext = parsed.mime.split("/")[1] || "ico";
        if (ext === "jpeg") ext = "jpg";
        buffer = Buffer.from(parsed.base64, "base64");
      } else {
        buffer = Buffer.from(faviconBase64, "base64");
      }

      const favFilename = `favicon.${ext}`;
      try {
        const res = await saveBufferToStorage(buffer, favFilename, mime);
        newSettings.favicon = res.url;
      } catch (e) {
        fs.writeFileSync(path.join(PUBLIC_DIR, favFilename), buffer);
        newSettings.favicon = `/${favFilename}`;
      }
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
