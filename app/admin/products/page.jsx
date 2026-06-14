export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export default async function ProductsPage() {
  await connectDB();
  const products = await Product.find({}).sort({ createdAt: -1 }).lean().exec();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🛒 Products</h1>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Rating</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{product.title}</td>
                  <td className="px-6 py-4">{product.price}</td>
                  <td className="px-6 py-4">⭐ {product.rating}</td>
                  <td className="px-6 py-4">
                    <form method="post" action={`/api/products/${product._id}/delete`}>
                      <button
                        type="submit"
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No products yet. Add one to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
