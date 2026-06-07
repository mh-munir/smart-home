export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">📊 Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-gray-600 font-semibold mb-2">Total Products</h3>
          <p className="text-4xl font-bold text-orange-500">120</p>
          <p className="text-sm text-gray-500 mt-2">Active products</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-gray-600 font-semibold mb-2">Total Blogs</h3>
          <p className="text-4xl font-bold text-blue-500">45</p>
          <p className="text-sm text-gray-500 mt-2">Published articles</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-gray-600 font-semibold mb-2">Affiliate Clicks</h3>
          <p className="text-4xl font-bold text-green-500">5,320</p>
          <p className="text-sm text-gray-500 mt-2">This month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">📈 Analytics</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Website Visits</span>
              <span className="font-bold">12,450</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Affiliate Conversions</span>
              <span className="font-bold">342</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Conversion Rate</span>
              <span className="font-bold text-green-600">2.7%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">🎯 Quick Actions</h2>
          <div className="space-y-2">
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded transition-colors">
              ➕ Add New Product
            </button>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition-colors">
              📝 Write New Blog
            </button>
            <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded transition-colors">
              🔄 Update SEO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
