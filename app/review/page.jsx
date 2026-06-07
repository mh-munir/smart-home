import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";
import { generateBlog } from "@/lib/seo";

export const metadata = {
  title: "Smart Home Product Reviews - Expert Buying Guide",
  description:
    "Browse our complete collection of smart home product reviews with detailed comparisons and expert recommendations.",
};

export default async function ReviewPage() {
  const products = await getProducts();
  const blog = generateBlog("Smart Home Products");

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-12 px-4">
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          <p className="text-xl text-gray-600 mb-8">{blog.intro}</p>

          {/* Table of Contents */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-2xl font-bold mb-4">📑 Contents</h2>
            <ul className="space-y-2">
              {blog.sections.map((section, index) => (
                <li key={index}>
                  <a href={`#section-${index}`} className="text-orange-500 hover:underline">
                    {section.heading}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Sections */}
          {blog.sections.map((section, index) => (
            <section key={index} id={`section-${index}`} className="mb-8">
              <h2 className="text-3xl font-bold mb-4">{section.heading}</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">{section.content}</p>
            </section>
          ))}

          {/* Products */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-8">🏆 Top Products</h2>
            {products && products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-600 text-lg">
                  Products coming soon. Check back later!
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
