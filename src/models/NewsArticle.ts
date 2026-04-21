import mongoose, { Schema, Document } from "mongoose";

export interface INewsArticle extends Document {
  title: { en: string; vi: string };
  content: { en: string; vi: string };
  excerpt: { en: string; vi: string };
  image: string;
  author: string;
  publishDate: Date;
  slug: string;
  category: string; // Ref Category
  tags: string[];
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

const NewsArticleSchema = new Schema<INewsArticle>(
  {
    title: {
      en: { type: String, required: true },
      vi: { type: String, required: true }
    },
    content: {
      en: { type: String, required: true },
      vi: { type: String, required: true }
    },
    excerpt: {
      en: { type: String, required: true },
      vi: { type: String, required: true }
    },
    image: { type: String, required: true },
    author: { type: String, required: true },
    publishDate: { type: Date, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
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

export default mongoose.models.NewsArticle ||
  mongoose.model<INewsArticle>("NewsArticle", NewsArticleSchema);
