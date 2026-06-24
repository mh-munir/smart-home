"use client";

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
      <div className="text-6xl mb-6">📡</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">You're Offline</h1>
      <p className="text-gray-500 max-w-md mb-8">
        It looks like you've lost your internet connection. Please check your network settings and try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
      >
        Try Again
      </button>
    </main>
  );
}