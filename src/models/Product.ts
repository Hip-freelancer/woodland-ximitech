import mongoose, { Schema, Document } from "mongoose";

const ProductSpecSchema = new Schema({
  attribute: { en: String, vi: String },
  specification: { en: String, vi: String },
  tolerance: String,
  standard: String,
});

const ProductApplicationSchema = new Schema({
  order: Number,
  title: { en: String, vi: String },
  subtitle: { en: String, vi: String },
  image: String,
});

const ProductContentBlockSchema = new Schema(
  {
    body: { en: { type: String, default: "" }, vi: { type: String, default: "" } },
    image: { type: String, default: "" },
    order: { type: Number, default: 0 },
    title: { en: { type: String, default: "" }, vi: { type: String, default: "" } },
    type: { type: String, default: "section" },
  },
  { _id: false }
);

const ProductDownloadSchema = new Schema(
  {
    label: { en: { type: String, default: "" }, vi: { type: String, default: "" } },
    url: { type: String, default: "" },
  },
  { _id: false }
);

const ProductFaqItemSchema = new Schema(
  {
    answer: { en: { type: String, default: "" }, vi: { type: String, default: "" } },
    order: { type: Number, default: 0 },
    question: { en: { type: String, default: "" }, vi: { type: String, default: "" } },
  },
  { _id: false }
);

export interface IProduct extends Document {
  name: { en: string; vi: string };
  series: string;
  slug: string;
  description: { en: string; vi: string };
  grade: { en: string; vi: string };
  category: string; // Ref Category slug
  thickness: number[];
  material: { en: string; vi: string };
  bonding: { en: string; vi: string };
  dimensions: string[];
  image: string;
  galleryImages: string[];
  certifications: string[];
  availability: { en: string; vi: string };
  contactLabel: { en: string; vi: string };
  contentBlocks: Array<{
    body: { en: string; vi: string };
    image: string;
    order: number;
    title: { en: string; vi: string };
    type: string;
  }>;
  downloads: Array<{ label: { en: string; vi: string }; url: string }>;
  faqItems: Array<{
    answer: { en: string; vi: string };
    order: number;
    question: { en: string; vi: string };
  }>;
  priceLabel: { en: string; vi: string };
  reviewCount: number;
  specifications: typeof ProductSpecSchema[];
  applications: typeof ProductApplicationSchema[];
  featured: boolean;
  isVisible: boolean;
  priority: number;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  sourceUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      en: { type: String, required: true },
      vi: { type: String, required: true }
    },
    series: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: {
      en: { type: String, required: true },
      vi: { type: String, required: true }
    },
    grade: {
      en: { type: String, required: true },
      vi: { type: String, required: true }
    },
    category: { type: String, required: true },
    thickness: [{ type: Number }],
    material: {
      en: { type: String },
      vi: { type: String }
    },
    bonding: {
      en: { type: String },
      vi: { type: String }
    },
    dimensions: [{ type: String }],
    image: { type: String, required: true },
    galleryImages: [{ type: String }],
    certifications: [{ type: String }],
    availability: {
      en: { type: String, default: "In Stock" },
      vi: { type: String, default: "Còn Hàng" }
    },
    contactLabel: {
      en: { type: String, default: "Contact" },
      vi: { type: String, default: "Lien he" }
    },
    contentBlocks: [ProductContentBlockSchema],
    downloads: [ProductDownloadSchema],
    faqItems: [ProductFaqItemSchema],
    priceLabel: {
      en: { type: String, default: "Contact for price" },
      vi: { type: String, default: "Lien he" }
    },
    reviewCount: { type: Number, default: 0 },
    specifications: [ProductSpecSchema],
    applications: [ProductApplicationSchema],
    featured: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: true },
    priority: { type: Number, default: 0 },
    seo: {
      title: { type: String },
      description: { type: String },
      keywords: { type: String },
    },
    sourceUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

ProductSchema.index({ isVisible: 1, priority: 1, createdAt: -1 });
ProductSchema.index({ isVisible: 1, category: 1, priority: 1, createdAt: -1 });
ProductSchema.index({ isVisible: 1, thickness: 1, priority: 1, createdAt: -1 });

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
