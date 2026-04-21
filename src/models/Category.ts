import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: {
    en: string;
    vi: string;
  };
  slug: string;
  image: string;
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

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      en: { type: String, required: true },
      vi: { type: String, required: true },
    },
    slug: { type: String, required: true, unique: true },
    image: { type: String, default: "" },
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

export default mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);
