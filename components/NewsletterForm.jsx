"use client";

import { useState } from "react";

function NewsletterForm({ source = "homepage" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "already" | "error"
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, source }),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        // Non-JSON responses still surface through the HTTP status below.
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
      setStatus("error");
      setMessage(`Network error: ${error?.message || "Failed to fetch"}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
      <label htmlFor={`newsletter-email-${source}`} className="sr-only">
        Email address
      </label>
      <input
        id={`newsletter-email-${source}`}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="min-w-0 px-4 py-3 border border-gray-300 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-100"
        required
        disabled={status === "loading"}
        autoComplete="email"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Subscribing..." : "Subscribe"}
      </button>

      {status === "success" && (
        <div className="sm:col-span-2 text-center text-green-600 font-medium text-sm">
          {message}
        </div>
      )}
      {status === "already" && (
        <div className="sm:col-span-2 text-center text-yellow-600 font-medium text-sm">
          {message}
        </div>
      )}
      {status === "error" && (
        <div className="sm:col-span-2 text-center text-red-600 font-medium text-sm">
          {message}
        </div>
      )}
    </form>
  );
}

export default NewsletterForm;
