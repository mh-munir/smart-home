"use client";

import { useState } from "react";

export default function NewsletterForm({ source = "homepage" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "already" | "error"
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source }),
      });

      const data = await res.json();

      if (res.ok && data.alreadySubscribed) {
        setStatus("already");
        setMessage(data.message);
      } else if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Network error. Please try again.");
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
        className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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