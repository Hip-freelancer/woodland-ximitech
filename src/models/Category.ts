import { normalizeCategoryContentType, type CategoryContentType } from "@/lib/category";
import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  contentType: CategoryContentType;
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
    contentType: {
      type: String,
      enum: ["product", "news"],
      default: "product",
      required: true,
    },
    slug: { type: String, required: true },
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

CategorySchema.index(
  { contentType: 1, slug: 1 },
  { unique: true, partialFilterExpression: { slug: { $type: "string" } } }
);

CategorySchema.pre("validate", function normalizeContentTypeBeforeValidate() {
  this.contentType = normalizeCategoryContentType(this.contentType);
});

export default mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);
