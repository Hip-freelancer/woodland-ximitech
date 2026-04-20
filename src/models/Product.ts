import mongoose, { Schema, Document } from "mongoose";

const ProductSpecSchema = new Schema({
  attribute: String,
  specification: String,
  tolerance: String,
  standard: String,
});

const ProductApplicationSchema = new Schema({
  order: Number,
  title: String,
  subtitle: String,
  image: String,
});

export interface IProduct extends Document {
  name: string;
  series: string;
  slug: string;
  description: string;
  grade: string;
  category: string;
  thickness: number[];
  material: string;
  bonding: string;
  dimensions: string[];
  image: string;
  galleryImages: string[];
  certifications: string[];
  availability: string;
  specifications: typeof ProductSpecSchema[];
  applications: typeof ProductApplicationSchema[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    series: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    grade: { type: String, required: true },
    category: { type: String, required: true },
    thickness: [{ type: Number }],
    material: { type: String },
    bonding: { type: String },
    dimensions: [{ type: String }],
    image: { type: String, required: true },
    galleryImages: [{ type: String }],
    certifications: [{ type: String }],
    availability: { type: String, default: "In Stock" },
    specifications: [ProductSpecSchema],
    applications: [ProductApplicationSchema],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
