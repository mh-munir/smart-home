'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SITE_URL } from '@/lib/site';

export default function ProductDetails() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

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
        setRelatedProducts(allProducts.filter(p => p.category === data.category && p.slug !== params.slug).slice(0, 3));
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
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-200 border-t-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-700 font-semibold text-lg">Loading product...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Product Not Found</h1>
            <p className="text-gray-600 mb-8 text-lg">{error || 'The product you are looking for does not exist.'}</p>
            <Link href="/" className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-bold transition-all">
              ← Back to Products
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
      <div className="min-h-screen bg-white">
        {/* Product Header - Hero Section */}
        <div className="bg-linear-to-r from-teal-600 to-teal-600 text-white py-12 sm:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-teal-100 capitalize">{product.category || 'Smart Home'}</span>
              <span className="text-teal-100">•</span>
              <span className="text-teal-100">⭐ {product.rating || 4.5}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              {product.title}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-teal-100">
              <span className="text-2xl font-bold text-white">{product.price || 'Contact for price'}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Product Image */}
          {product.image && (
            <div className="mb-12">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-96 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}

          {/* Description */}
          <div className="prose prose-lg max-w-none mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {product.description || 'A premium smart home product designed for modern living.'}
            </p>
          </div>

          {/* Features */}
          <div className="mb-12 pb-12 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Key Features</h3>
            <ul className="space-y-3">
              {[
                'High Quality Construction',
                'Easy Installation',
                'Affordable Price',
                'Excellent Customer Support',
                '24/7 Availability',
                'Fast Shipping Available'
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-700">
                  <span className="text-teal-600 font-bold">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Stats */}
          {product.clicks !== undefined && (
            <div className="bg-gray-50 p-8 rounded-lg mb-12 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Product Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Clicks</p>
                  <p className="text-2xl font-bold text-gray-900">{product.clicks || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Conversions</p>
                  <p className="text-2xl font-bold text-gray-900">{product.conversions || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Rating</p>
                  <p className="text-2xl font-bold text-gray-900">⭐ {product.rating || 4.5}</p>
                </div>
              </div>
            </div>
          )}

          {/* Share Section */}
          <div className="border-t border-b border-gray-200 py-6 mb-12">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Share This Product</h3>
            <div className="flex gap-4">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(product.title)}&url=${SITE_URL}/products/${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:text-teal-700 font-semibold"
              >
                Twitter
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${SITE_URL}/products/${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:text-teal-700 font-semibold"
              >
                Facebook
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${SITE_URL}/products/${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:text-teal-700 font-semibold"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.slug}
                    href={`/products/${relatedProduct.slug}`}
                    className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
                  >
                    {relatedProduct.image && (
                      <div className="bg-gray-100 h-32 overflow-hidden">
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-teal-600 line-clamp-2">
                        {relatedProduct.title}
                      </h3>
                      <p className="text-sm text-teal-600 font-bold">
                        {relatedProduct.price || 'Contact for price'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA Section */}
          <section className="bg-teal-50 border-l-4 border-teal-600 p-6 rounded mb-12">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Get This Product Now</h3>
            <p className="text-gray-700 mb-6">
              Ready to upgrade your smart home? Click below to purchase this product at the best price.
            </p>
            {(() => {
              // Determine primary affiliate link
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

              const href = primary?.url || '#';
              const label = primary ? `Buy on ${primary.name}` : 'Buy Now';

              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition font-semibold"
                >
                  {label}
                </a>
              );
            })()}
          </section>

          {/* Back Link */}
          <Link
            href="/"
            className="text-teal-600 hover:text-teal-700 font-semibold"
          >
            ← Back to All Products
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
