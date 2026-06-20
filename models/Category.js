import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

CategorySchema.index({ name: 1 });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
