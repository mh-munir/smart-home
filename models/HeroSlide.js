import mongoose from "mongoose";

const HeroSlideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    ctaText: {
      type: String,
      default: "Explore Products",
      trim: true,
    },
    ctaLink: {
      type: String,
      default: "/blog",
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.HeroSlide ||
  mongoose.model("HeroSlide", HeroSlideSchema);
