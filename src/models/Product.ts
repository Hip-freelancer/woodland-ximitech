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
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
