"use client";

import React, { useState, memo } from "react";

function NewsletterForm({ source = "homepage" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "already" | "error"
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const apiUrl = typeof window !== "undefined" ? new URL("/api/subscribers", window.location.origin).href : "/api/subscribers";
      // debug log the request URL (helps when dev server uses a different port)
      // console.debug("Subscribing to:", apiUrl);

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch (parseErr) {
        console.warn("/api/subscribers returned non-JSON response", parseErr);
      }

      if (res.ok && data?.alreadySubscribed) {
        setStatus("already");
        setMessage(data.message || "You are already subscribed.");
      } else if (res.ok) {
        setStatus("success");
        setMessage(data?.message || "Successfully subscribed!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage((data && (data.error || data.message)) || `Server error: ${res.status}`);
      }
    } catch (error) {
      console.error("Newsletter subscribe failed:", error);
      setStatus("error");
      setMessage(`Network error: ${error?.message || "Failed to fetch"}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-100"
        required
        disabled={status === "loading"}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Subscribing..." : "Subscribe"}
      </button>

      {/* Status Messages */}
      {status === "success" && (
        <div className="sm:col-span-2 text-center text-green-600 font-medium text-sm mt-2">
          ✅ {message}
        </div>
      )}
      {status === "already" && (
        <div className="sm:col-span-2 text-center text-yellow-600 font-medium text-sm mt-2">
          ℹ️ {message}
        </div>
      )}
      {status === "error" && (
        <div className="sm:col-span-2 text-center text-red-600 font-medium text-sm mt-2">
          ❌ {message}
        </div>
      )}
    </form>
  );
}

export default memo(NewsletterForm);