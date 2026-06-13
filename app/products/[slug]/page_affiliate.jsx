'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SITE_URL } from '@/lib/site';

export default function ProductDetailsAffiliate() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products?slug=${params.slug}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);

        // Fetch related products
        const allProducts = await fetch('/api/products').then(r => r.json());
        setRelatedProducts(allProducts.filter(p => p.category === data.category && p.slug !== params.slug).slice(0, 4));
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-gray-50 to-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-200 border-t-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-700 font-semibold text-lg">পণ্য লোড হচ্ছে...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center bg-white p-12 rounded-2xl max-w-md mx-4 border border-gray-200">
            <div className="text-5xl mb-4">❌</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">পণ্য খুঁজে পাওয়া যায়নি</h1>
            <p className="text-gray-600 mb-8 text-lg">{error || 'আপনি যে পণ্যটি খুঁজছেন তা বিদ্যমান নেই।'}</p>
            <Link href="/products" className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-bold transition-all">
              ← পণ্যে ফিরুন
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-teal-600">হোম</Link>
              <span>/</span>
              <Link href="/products" className="hover:text-teal-600">পণ্য</Link>
              <span>/</span>
              <span className="text-gray-900 font-semibold">{product.title}</span>
            </div>
          </div>
        </div>

        {/* Product Header Hero */}
        <div className="bg-linear-to-r from-teal-600 via-teal-500 to-cyan-500 text-white py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Left - Product Image */}
              <div className="flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-80 object-cover rounded-xl shadow-2xl border-4 border-white"
                  />
                ) : (
                  <div className="w-full h-80 bg-white/20 rounded-xl flex items-center justify-center text-6xl">
                    📦
                  </div>
                )}
              </div>

              {/* Right - Product Info */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-semibold capitalize">
                    {product.category || 'স্মার্ট হোম'}
                  </span>
                  <span className="text-2xl">⭐ {product.rating || 4.5}/5</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {product.title}
                </h1>
                
                <p className="text-lg text-teal-100 mb-8">
                  {product.description || 'প্রিমিয়াম স্মার্ট হোম পণ্য'}
                </p>

                {/* Price Section */}
                <div className="bg-white/10 rounded-lg p-6 mb-8 border border-white/20">
                  <div className="text-sm text-teal-100 mb-2">বর্তমান মূল্য</div>
                  <div className="text-4xl font-bold text-white mb-2">
                    {product.price || 'যোগাযোগ করুন'}
                  </div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="flex items-center gap-4">
                      <span className="text-teal-100 line-through">আসল মূল্য: {product.originalPrice}</span>
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% ছাড়
                      </span>
                    </div>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  {(() => {
                    let primary = null;
                    if (product.affiliateLinks && typeof product.affiliateLinks === 'object') {
                      const entries = Object.entries(product.affiliateLinks)
                        .filter(([k, v]) => v && v.url && v.enabled)
                        .map(([k, v]) => ({ id: k, url: v.url, priority: v.priority || 0, name: (v.name || (k.charAt(0).toUpperCase() + k.slice(1))) }));
                      if (entries.length > 0) {
                        entries.sort((a, b) => (b.priority || 0) - (a.priority || 0));
                        primary = entries[0];
                      }
                    }
                    if (!primary && product.affiliateLink) {
                      primary = { id: 'legacy', url: product.affiliateLink, name: 'Vendor' };
                    }

                    if (primary) {
                      return (
                        <a
                          href={primary.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-4 rounded-lg text-center transition-all transform hover:scale-105 shadow-lg"
                        >
                          🛒 এখনই কিনুন ({primary.name})
                        </a>
                      );
                    }

                    return (
                      <button className="block w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-4 rounded-lg transition-all">
                        🛒 এখনই কিনুন
                      </button>
                    );
                  })()}

                  <button className="block w-full bg-white/20 hover:bg-white/30 text-white font-bold py-3 rounded-lg border border-white/40 transition-all">
                    💬 বিক্রেতার সাথে যোগাযোগ করুন
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/20">
                  <div className="text-center">
                    <div className="text-2xl mb-2">✓</div>
                    <div className="text-sm">সত্যায়িত পণ্য</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🚚</div>
                    <div className="text-sm">দ্রুত ডেলিভারি</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🔒</div>
                    <div className="text-sm">নিরাপদ লেনদেন</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="flex gap-4 mb-8 border-b border-gray-200">
                {['overview', 'features', 'specs', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 px-4 font-semibold transition-all ${
                      activeTab === tab
                        ? 'text-teal-600 border-b-2 border-teal-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">পণ্য বিবরণ</h2>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {product.description || 'এটি একটি প্রিমিয়াম স্মার্ট হোম পণ্য যা আধুনিক জীবনযাত্রার জন্য ডিজাইন করা হয়েছে।'}
                    </p>
                  </div>

                  {product.longDescription && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">বিস্তারিত বর্ণনা</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {product.longDescription}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Features Tab */}
              {activeTab === 'features' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">মূল বৈশিষ্ট্য</h2>
                  <ul className="space-y-3">
                    {[
                      'উচ্চ মানের নির্মাণ',
                      'সহজ ইনস্টলেশন',
                      'সাশ্রয়ী মূল্য',
                      'চমৎকার গ্রাহক সেবা',
                      '২৪/৭ প্রাপ্যতা',
                      'দ্রুত ডেলিভারি উপলব্ধ'
                    ].map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-4 p-4 bg-teal-50 rounded-lg border border-teal-200">
                        <span className="text-2xl text-teal-600">✓</span>
                        <span className="text-gray-900 font-semibold">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specs Tab */}
              {activeTab === 'specs' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">প্রযুক্তিগত স্পেসিফিকেশন</h2>
                  <div className="space-y-3 border border-gray-200 rounded-lg overflow-hidden">
                    {[
                      { label: 'ব্র্যান্ড', value: product.brand || 'প্রিমিয়াম' },
                      { label: 'বিভাগ', value: product.category || 'স্মার্ট হোম' },
                      { label: 'রঙ', value: 'কালো' },
                      { label: 'সংযোগ', value: 'ওয়াই-ফাই / ব্লুটুথ' },
                      { label: 'ওয়ারেন্টি', value: '১ বছর' }
                    ].map((spec, idx) => (
                      <div key={idx} className="flex border-b border-gray-200 last:border-b-0">
                        <div className="w-1/3 bg-gray-50 p-4 font-semibold text-gray-900">
                          {spec.label}
                        </div>
                        <div className="w-2/3 p-4 text-gray-700">
                          {spec.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">গ্রাহক পর্যালোচনা</h2>
                  <div className="space-y-4">
                    {[1, 2, 3].map((rev) => (
                      <div key={rev} className="p-6 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-yellow-400">★★★★★</span>
                          <span className="font-semibold text-gray-900">গ্রাহক {rev}</span>
                        </div>
                        <p className="text-gray-700">এটি একটি দুর্দান্ত পণ্য! খুব সন্তুষ্ট আছি। সুপারিশ করি।</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              {/* Price Card */}
              <div className="bg-linear-to-br from-teal-600 to-teal-700 text-white p-6 rounded-xl shadow-lg mb-6">
                <h3 className="text-sm font-bold uppercase mb-4 opacity-90">মূল্য তথ্য</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm opacity-90">বর্তমান মূল্য</p>
                    <p className="text-3xl font-bold">{product.price || 'যোগাযোগ'}</p>
                  </div>
                  {product.affiliateLink && (
                    <a
                      href={product.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 rounded-lg text-center transition-all"
                    >
                      এখনই কিনুন
                    </a>
                  )}
                </div>
              </div>

              {/* Product Stats */}
              {product.clicks !== undefined && (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6">
                  <h3 className="font-bold text-gray-900 mb-4">পণ্য পরিসংখ্যান</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">ক্লিক</p>
                      <p className="text-2xl font-bold text-gray-900">{product.clicks || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">রূপান্তর</p>
                      <p className="text-2xl font-bold text-gray-900">{product.conversions || 0}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Share Product */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">শেয়ার করুন</h3>
                <div className="space-y-2">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-all">
                    Facebook
                  </button>
                  <button className="w-full bg-blue-400 hover:bg-blue-500 text-white py-2 rounded-lg font-semibold transition-all">
                    Twitter
                  </button>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-all">
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 pt-12 border-t border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">সম্পর্কিত পণ্য</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relProduct) => (
                  <Link
                    key={relProduct.id}
                    href={`/products/${relProduct.slug}`}
                    className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    <div className="bg-linear-to-br from-teal-500 to-teal-600 h-40 flex items-center justify-center text-4xl">
                      {relProduct.image ? (
                        <img src={relProduct.image} alt={relProduct.title} className="w-full h-full object-cover" />
                      ) : (
                        '📦'
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 group-hover:text-teal-600 transition line-clamp-2">
                        {relProduct.title}
                      </h3>
                      <p className="text-teal-600 font-bold text-lg mt-2">{relProduct.price}</p>
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-yellow-400">★ {relProduct.rating || 4.5}</span>
                        <span className="text-teal-600 font-semibold">বিস্তারিত →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
