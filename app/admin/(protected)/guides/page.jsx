import Link from 'next/link';
import { connectDB } from '@/lib/db';
import Guide from '@/models/Guide';

export const dynamic = 'force-dynamic';

export default async function AdminGuidesPage() {
  await connectDB();
  const guides = await Guide.find({}).sort({ createdAt: -1 }).lean().exec();

  return (
    <div className="p-8 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">📚 Guides</h1>
        <Link href="/admin/add-guide" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">+ Add Guide</Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {guides.map((g) => (
              <tr key={g._id} className="border-b last:border-b-0">
                <td className="px-6 py-4">{g.title}</td>
                <td className="px-6 py-4">{g.category}</td>
                <td className="px-6 py-4">
                  <Link href={`/guides/${g.slug}`} className="text-teal-600 hover:underline mr-3">View</Link>
                  <Link href={`/admin/guides/${g._id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
