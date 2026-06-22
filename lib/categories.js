import { connectDB } from "@/lib/db";
import Category from "@/models/Category";

export async function getCategories() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ name: 1 }).lean();
    return categories.map((cat) => ({
      _id: cat._id.toString(),
      name: cat.name,
    }));
  } catch {
    return [];
  }
}