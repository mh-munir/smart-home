import mongoose from "mongoose";

const ClickEventSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
      enum: ["product_click", "affiliate_click", "category_click", "blog_click"],
      index: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      default: null,
    },
    affiliateId: {
      type: String,
      default: null,
    },
    url: {
      type: String,
      default: null,
    },
    referrer: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
    ip: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for analytics queries
ClickEventSchema.index({ createdAt: -1 });
ClickEventSchema.index({ eventType: 1, createdAt: -1 });
ClickEventSchema.index({ productId: 1, eventType: 1 });

export default mongoose.models.ClickEvent ||
  mongoose.model("ClickEvent", ClickEventSchema);