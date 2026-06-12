export default function AnalyticsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">📈 Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-gray-600 font-semibold mb-2">Total Visitors</h3>
          <p className="text-3xl font-bold text-primary-500">45,230</p>
          <p className="text-xs text-gray-500 mt-2">↑ 12% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-gray-600 font-semibold mb-2">Affiliate Clicks</h3>
          <p className="text-3xl font-bold text-orange-500">5,320</p>
          <p className="text-xs text-gray-500 mt-2">↑ 8% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-gray-600 font-semibold mb-2">Conversions</h3>
          <p className="text-3xl font-bold text-green-500">342</p>
          <p className="text-xs text-gray-500 mt-2">↑ 15% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-gray-600 font-semibold mb-2">Conversion Rate</h3>
          <p className="text-3xl font-bold text-purple-500">2.7%</p>
          <p className="text-xs text-gray-500 mt-2">↑ 0.3% from last month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Top Products</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span>Smart Door Lock Pro</span>
              <span className="font-bold">1,245 clicks</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span>Smart Camera 4K</span>
              <span className="font-bold">892 clicks</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span>Smart Bulb Starter Kit</span>
              <span className="font-bold">765 clicks</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Top Articles</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span>Best Smart Door Locks 2026</span>
              <span className="font-bold">3,245 views</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span>Smart Home Setup Guide</span>
              <span className="font-bold">2,156 views</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span>Budget Smart Home Devices</span>
              <span className="font-bold">1,876 views</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
