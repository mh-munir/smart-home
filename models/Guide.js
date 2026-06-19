import mongoose from 'mongoose';

const GuideSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    category: { type: String, default: 'Guides' },
    excerpt: { type: String, default: '' },
    image: { type: String, default: '' },
    images: { type: [String], default: [] },
    content: { type: String, default: '' },
    tags: { type: [String], default: [] },
    readTime: { type: Number, default: 5 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Guide || mongoose.model('Guide', GuideSchema);
