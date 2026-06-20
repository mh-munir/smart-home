import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin-session";

const NOTIFICATIONS_PATH = path.join(process.cwd(), "data", "notifications.json");

function readNotifications() {
  try {
    const raw = fs.readFileSync(NOTIFICATIONS_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeNotifications(notifications) {
  try {
    fs.mkdirSync(path.dirname(NOTIFICATIONS_PATH), { recursive: true });
    fs.writeFileSync(NOTIFICATIONS_PATH, JSON.stringify(notifications, null, 2), "utf8");
  } catch (e) {
    console.error("Failed writing notifications:", e);
  }
}

// GET - Fetch all notifications (admin)
export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get(ADMIN_SESSION_COOKIE);
    const token = tokenCookie && tokenCookie.value ? tokenCookie.value : null;
    const session = token ? verifySessionToken(token) : null;
    if (!session) {
      return NextResponse.json({ error: "not_authorized" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "not_authorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    let notifications = readNotifications();

    // Sort by createdAt descending
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Limit to 50 most recent
    notifications = notifications.slice(0, 50);

    if (unreadOnly) {
      notifications = notifications.filter((n) => !n.read);
    }

    const unreadCount = readNotifications().filter((n) => !n.read).length;

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

// PATCH - Mark notifications as read
export async function PATCH(request) {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get(ADMIN_SESSION_COOKIE);
    const token = tokenCookie && tokenCookie.value ? tokenCookie.value : null;
    const session = token ? verifySessionToken(token) : null;
    if (!session) {
      return NextResponse.json({ error: "not_authorized" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "not_authorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { markAllRead, notificationId } = body || {};

    let notifications = readNotifications();

    if (markAllRead) {
      notifications = notifications.map((n) => ({ ...n, read: true }));
    } else if (notificationId) {
      notifications = notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      );
    }

    writeNotifications(notifications);

    const unreadCount = notifications.filter((n) => !n.read).length;

    return NextResponse.json({ success: true, unreadCount });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 });
  }
}

// DELETE - Clear all notifications
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get(ADMIN_SESSION_COOKIE);
    const token = tokenCookie && tokenCookie.value ? tokenCookie.value : null;
    const session = token ? verifySessionToken(token) : null;
    if (!session) {
      return NextResponse.json({ error: "not_authorized" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "not_authorized" }, { status: 401 });
  }

  try {
    writeNotifications([]);
    return NextResponse.json({ success: true, unreadCount: 0 });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    return NextResponse.json({ error: "Failed to clear notifications" }, { status: 500 });
  }
}