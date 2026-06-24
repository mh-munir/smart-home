"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminAvatar, setAdminAvatar] = useState(null);
  const [adminName, setAdminName] = useState("Admin");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const pageTitle = pathname?.split("/").filter(Boolean).slice(-1)[0]?.replace(/-/g, " ") || "Admin";

  // Fetch admin avatar from settings
  useEffect(() => {
    fetch("/api/settings", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.adminAvatar) setAdminAvatar(data.adminAvatar);
        if (data?.adminName) setAdminName(data.adminName);
      })
      .catch(() => {});
  }, []);

  // Fetch notifications – stop polling on 401 (not logged in)
  useEffect(() => {
    // Skip on the login page – there's no session to fetch notifications for
    if (isLoginPage) return;

    const controller = new AbortController();
    let pollInterval = null;
    let stopped = false;

    const doFetch = () => {
      if (stopped) return;
      fetch("/api/admin/notifications", {
        credentials: "same-origin",
        signal: controller.signal,
      })
        .then((r) => {
          if (r.status === 401) {
            // Not authenticated – stop polling entirely
            stopped = true;
            if (pollInterval) clearInterval(pollInterval);
            return null;
          }
          return r.json();
        })
        .then((data) => {
          if (data?.notifications) {
            setNotifications(data.notifications);
            setUnreadCount(data.unreadCount || 0);
          }
        })
        .catch(() => {});
    };

    doFetch();
    pollInterval = setInterval(doFetch, 30000);

    return () => {
      stopped = true;
      if (pollInterval) clearInterval(pollInterval);
      controller.abort();
    };
  }, [isLoginPage]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      // Check all notification bell containers
      const containers = document.querySelectorAll("[data-notification-bell]");
      let insideAny = false;
      containers.forEach((c) => {
        if (c.contains(e.target)) insideAny = true;
      });
      if (!insideAny) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = async () => {
    try {
      await fetch("/api/admin/notifications", {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch("/api/admin/notifications", {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await fetch("/api/admin/notifications", {
        method: "DELETE",
        credentials: "same-origin",
      });
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (isLoginPage) {
    return children;
  }

  return (
    <div className="flex" suppressHydrationWarning>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col md:ml-65">
        {/* Mobile top bar with toggle */}
        <div className="md:hidden bg-white border-b border-gray-200 px-3 py-2.5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <button
              aria-label="Open sidebar"
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="font-semibold text-base text-gray-800">{adminName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Bell icon - Mobile */}
            <div className="relative" data-notification-bell>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <NotificationDropdown
                  notifications={notifications}
                  unreadCount={unreadCount}
                  onMarkAllRead={markAllAsRead}
                  onMarkRead={markAsRead}
                  onClearAll={clearAllNotifications}
                  formatTime={formatTime}
                />
              )}
            </div>
            {/* Admin avatar - Mobile */}
            <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
              {adminAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={adminAvatar}
                  alt="Admin avatar"
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                  A
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Desktop header */}
        <header className="hidden md:flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-6 py-3 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">
              {pageTitle && pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1)}
            </h1>
            <span className="hidden sm:inline text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              Admin Panel
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden lg:block relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="search"
                placeholder="Search anything..."
                className="w-56 lg:w-64 bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none transition-all"
              />
            </div>

            {/* Notification bell - Desktop */}
            <div className="relative" data-notification-bell>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <NotificationDropdown
                  notifications={notifications}
                  unreadCount={unreadCount}
                  onMarkAllRead={markAllAsRead}
                  onMarkRead={markAsRead}
                  onClearAll={clearAllNotifications}
                  formatTime={formatTime}
                />
              )}
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-gray-200 mx-1" />

            {/* Admin profile - Desktop */}
            <button className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-gray-100 transition-colors group">
              {adminAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={adminAvatar}
                  alt="Admin avatar"
                  width={36}
                  height={36}
                  className="rounded-full object-cover shadow-md ring-2 ring-white group-hover:ring-primary-100 transition-all"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary-500/20 ring-2 ring-white group-hover:ring-primary-100 transition-all">
                  A
                </div>
              )}
              <div className="hidden xl:flex flex-col items-start">
                <span className="text-sm font-semibold text-gray-800 leading-tight">{adminName}</span>
                <span className="text-[11px] text-gray-400 leading-tight">Super Admin</span>
              </div>
              <svg className="w-4 h-4 text-gray-400 hidden xl:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </header>

        <main className="flex-1 bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  );
}

function NotificationDropdown({ notifications, unreadCount, onMarkAllRead, onMarkRead, onClearAll, formatTime }) {
  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-gray-400 hover:text-red-500 font-medium"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Notification list */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <svg className="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            <p className="text-sm text-gray-400">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => !notif.read && onMarkRead(notif.id)}
              className={`px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors ${
                notif.read
                  ? "bg-white hover:bg-gray-50"
                  : "bg-primary-50/50 hover:bg-primary-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${notif.read ? "bg-gray-300" : "bg-primary-500"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{notif.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{formatTime(notif.createdAt)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}