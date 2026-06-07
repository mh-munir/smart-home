'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProductDetails() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageZoom, setImageZoom] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products?slug=${params.slug}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchProduct();
    }
  }, [params.slug]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-700 font-semibold text-lg">Loading amazing product...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-50 to-orange-50">
          <div className="text-center bg-white p-12 rounded-2xl shadow-2xl max-w-md mx-4">
            <div className="text-5xl mb-4">❌</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Product Not Found</h1>
            <p className="text-gray-600 mb-8 text-lg">{error || 'The product you are looking for does not exist.'}</p>
            <Link href="/" className="inline-block bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-lg font-bold transition-all transform hover:scale-105">
              ← Back to Products
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link href="/" className="text-teal-600 hover:text-teal-700 font-semibold transition-colors text-sm uppercase tracking-wide">
              ← Back to Products
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="flex flex-col">
              <div 
                className="relative bg-gray-100 overflow-hidden h-96 md:h-full md:min-h-96 border border-gray-200 group cursor-zoom-in"
                onMouseEnter={() => setImageZoom(true)}
                onMouseLeave={() => setImageZoom(false)}
                onMouseMove={handleMouseMove}
              >
                {product.image ? (
                  <>
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className={`object-cover transition-transform duration-300 ${
                        imageZoom ? 'scale-125' : 'scale-100'
                      }`}
                      style={imageZoom ? {
                        transformOrigin: `${mousePos.x}% ${mousePos.y}%`
                      } : {}}
                      unoptimized
                    />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center flex-col gap-3 text-gray-400">
                    <span className="text-5xl">📷</span>
                    <p className="font-semibold">No image available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Product Information */}
            <div className="flex flex-col">
              {/* Category */}
              {product.category && (
                <div className="mb-4">
                  <span className="text-teal-600 text-xs uppercase font-bold tracking-wide">
                    {product.category}
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                {product.title}
              </h1>

              {/* Rating and Price */}
              <div className="flex items-baseline gap-6 mb-8 pb-8 border-b border-gray-200">
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-1">Rating</p>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 text-2xl">★</span>
                    <p className="text-2xl font-bold text-gray-900">
                      {product.rating || 4.5}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-1">Price</p>
                  <p className="text-3xl font-bold text-teal-600">
                    {product.price || 'Contact for price'}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                {product.description || 'Premium smart home product'}
              </p>

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-4">Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3 text-gray-700">
                    <span className="text-teal-600">✓</span>
                    <span>High Quality Product</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <span className="text-teal-600">✓</span>
                    <span>Fast Delivery</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <span className="text-teal-600">✓</span>
                    <span>Affordable Price</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <span className="text-teal-600">✓</span>
                    <span>Customer Service</span>
                  </li>
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3 pt-4">
                <a
                  href={product.affiliateLink || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-teal-600 hover:bg-teal-700 text-white px-6 py-4 rounded font-bold text-center text-lg transition-colors"
                >
                  Buy Now
                </a>
                <Link
                  href="/"
                  className="block border-2 border-teal-600 text-teal-600 hover:bg-teal-50 px-6 py-4 rounded font-bold text-center transition-colors"
                >
                  View More Products
                </Link>
              </div>
            </div>
          </div>

          {/* Product Stats */}
          {product.clicks !== undefined || product.conversions !== undefined ? (
            <div className="mt-16 pt-12 border-t border-gray-200">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8">Product Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-gray-50 p-6 border border-gray-200">
                  <p className="text-gray-600 text-xs font-bold uppercase tracking-wide mb-2">Total Clicks</p>
                  <p className="text-3xl font-bold text-gray-900">{product.clicks || 0}</p>
                </div>
                <div className="bg-gray-50 p-6 border border-gray-200">
                  <p className="text-gray-600 text-xs font-bold uppercase tracking-wide mb-2">Conversions</p>
                  <p className="text-3xl font-bold text-gray-900">{product.conversions || 0}</p>
                </div>
                <div className="bg-gray-50 p-6 border border-gray-200">
                  <p className="text-gray-600 text-xs font-bold uppercase tracking-wide mb-2">Created</p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-50 p-6 border border-gray-200">
                  <p className="text-gray-600 text-xs font-bold uppercase tracking-wide mb-2">Category</p>
                  <p className="text-lg font-bold text-gray-900">{product.category || 'N/A'}</p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Why Trust Section */}
          <div className="mt-16 pt-12 border-t border-gray-200">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8">Why Choose This Product?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border border-gray-200 p-6">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Accurate & Reliable</h3>
                <p className="text-gray-600 text-sm">Best quality products carefully selected for you</p>
              </div>
              <div className="border border-gray-200 p-6">
                <div className="text-3xl mb-3">🚀</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Fast Shipping</h3>
                <p className="text-gray-600 text-sm">Quick and reliable delivery to your doorstep</p>
              </div>
              <div className="border border-gray-200 p-6">
                <div className="text-3xl mb-3">💯</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Complete Support</h3>
                <p className="text-gray-600 text-sm">24/7 customer service for your peace of mind</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
      <Footer />
    </>
  );
}
