'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
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
        const response = await fetch(`/api/products?slug=${params?.slug}`);

        if (!response.ok) {
          throw new Error('Product not found');
        }

        const data = await response.json();
        setProduct(data);

        const allRes = await fetch('/api/products');

        if (allRes.ok) {
          const contentType = allRes.headers.get('content-type') || '';

          if (contentType.includes('application/json')) {
            const allProducts = await allRes.json();

            setRelatedProducts(
              allProducts
                .filter(
                  (p) =>
                    p.category === data.category &&
                    p.slug !== params?.slug
                )
                .slice(0, 3)
            );
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params?.slug) {
      fetchProduct();
    }
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-200 border-t-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold text-lg">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center bg-white p-12 rounded-2xl max-w-md mx-4 border border-gray-200">
          <div className="text-5xl mb-4">❌</div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">Product Not Found</h1>

          <p className="text-gray-600 mb-8 text-lg">{error || 'The product you are looking for does not exist.'}</p>

          <Link href="/" className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-bold">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">

        <div className="bg-linear-to-r from-orange-500 to-red-600 py-12 min-h-64">
          <div className="max-w-4xl mx-auto px-4 flex items-center justify-center text-center">
            <h1 className="text-4xl font-bold text-white">Product Details</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="my-6">
            <p className="mb-3 capitalize">
              {product.category || 'Smart Home'}
            </p>

            <h1 className="text-4xl font-bold mb-4">
              {product.title}
            </h1>

            <p className="text-2xl font-semibold">
              Price: {product.price || 'Contact for price'}
            </p>
          </div>
          {product.image && (
            <div className="w-full rounded-lg mb-10 overflow-hidden">
              <Image
                src={product.image}
                alt={product.title}
                width={1200}
                height={700}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          )}

          <h2 className="text-2xl font-bold mb-4">
            Product Description
          </h2>

          <p className="text-gray-700 leading-relaxed mb-10">
            {product.description}
          </p>

          <div className="bg-teal-50 p-6 rounded-lg mb-10">
            <h3 className="text-xl font-bold mb-4">
              Buy This Product
            </h3>

            <a
              href={product.affiliateLink || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg"
            >
              Buy Now
            </a>
          </div>

          {relatedProducts.length > 0 && (
            <>
              <h2 className="text-2xl font-bold mb-6">
                Related Products
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {relatedProducts.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/products/${item.slug}`}
                    className="border rounded-lg overflow-hidden"
                  >
                    {item.image && (
                      <div className="w-full h-48 relative">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      </div>
                    )}

                    <div className="p-4">
                      <h3 className="font-bold">
                        {item.title}
                      </h3>

                      <p className="text-teal-600 mt-2">
                        {item.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
  );
}