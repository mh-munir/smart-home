import mongoose, { Document, Schema, model, models } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  description?: string;
  content?: string;
  category?: string;
  keywords?: string[];
  image?: string;
  images: string[];
  imageUrls: string[];
  author?: string;
  tags: string[];
  readTime: number;
  affiliateLink?: string | null;
  views: number;
  clicks: number;
  affiliateProducts: mongoose.Types.ObjectId[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    description: String,
    content: String,
    category: String,
    keywords: [String],
    image: String,
    images: {
      type: [String],
      default: [],
    },
    imageUrls: {
      type: [String],
      default: [],
    },
    author: {
      type: String,
      default: "Smart Home Team",
    },
    tags: {
      type: [String],
      default: [],
    },
    readTime: {
      type: Number,
      default: 5,
    },
    affiliateLink: {
      type: String,
      default: null,
    },
    views: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    affiliateProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default models.Blog || model<IBlog>("Blog", BlogSchema);
