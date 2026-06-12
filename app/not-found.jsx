'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-primary-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full">
          {/* 404 Animation */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-linear-to-r from-primary-500 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-linear-to-r from-primary-600 via-purple-600 to-pink-600 animate-bounce">
                404
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h1>
            <p className="text-gray-600 text-lg mb-2">
              The page you&apos;re looking for doesn&apos;t exist.
            </p>
            <p className="text-gray-500 text-base">
              It may have been moved or the link might be incorrect.
            </p>
          </div>

          {/* Illustration */}
          <div className="mb-12 text-center">
            <div className="inline-block text-8xl animate-bounce">
              🔍
            </div>
          </div>

          {/* Error Details */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="text-4xl">⚠️</div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-gray-900 mb-2 text-lg">What happened?</h3>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">✓</span>
                    <span>The page was deleted or moved</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">✓</span>
                    <span>The URL is incorrect or misspelled</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">✓</span>
                    <span>The link is no longer active</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-linear-to-r from-primary-600 to-primary-600 hover:from-primary-700 hover:to-primary-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 hover:shadow-xl shadow-lg text-center text-lg"
            >
              🏠 Back to Home
            </Link>
            <Link
              href="/"
              className="block w-full border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-bold py-4 px-6 rounded-xl transition-all text-center text-lg"
            >
              📦 Browse Products
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-600 mb-4">
              Need help?
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
              >
                <span>📧</span> Contact Us
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
              >
                <span>❓</span> Help Center
              </Link>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>
      <Footer />
    </>
  );
}
