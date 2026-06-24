import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    thumbnail: { type: String, default: null },
  },
  { timestamps: true }
);

// Index for faster lookups
CategorySchema.index({ name: 1 });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
