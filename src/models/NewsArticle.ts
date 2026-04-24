import mongoose, { Schema, Document } from "mongoose";

const NewsContentBlockSchema = new Schema(
  {
    body: { en: { type: String, default: "" }, vi: { type: String, default: "" } },
    image: { type: String, default: "" },
    order: { type: Number, default: 0 },
    title: { en: { type: String, default: "" }, vi: { type: String, default: "" } },
    type: { type: String, default: "section" },
  },
  { _id: false }
);

const NewsTocEntrySchema = new Schema(
  {
    id: { type: String, default: "" },
    level: { type: Number, default: 2 },
    title: { type: String, default: "" },
  },
  { _id: false }
);

const NewsFaqItemSchema = new Schema(
  {
    answer: { en: { type: String, default: "" }, vi: { type: String, default: "" } },
    order: { type: Number, default: 0 },
    question: { en: { type: String, default: "" }, vi: { type: String, default: "" } },
  },
  { _id: false }
);

export interface INewsArticle extends Document {
  title: { en: string; vi: string };
  content: { en: string; vi: string };
  excerpt: { en: string; vi: string };
  faqItems: Array<{
    answer: { en: string; vi: string };
    order: number;
    question: { en: string; vi: string };
  }>;
  image: string;
  galleryImages: string[];
  author: string;
  publishDate: Date;
  slug: string;
  category: string; // Ref Category
  tags: string[];
  contentBlocks: Array<{
    body: { en: string; vi: string };
    image: string;
    order: number;
    title: { en: string; vi: string };
    type: string;
  }>;
  isVisible: boolean;
  priority: number;
  relatedSlugs: string[];
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  sourceUrl: string;
  toc: Array<{ id: string; level: number; title: string }>;
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
    faqItems: [NewsFaqItemSchema],
    galleryImages: [{ type: String }],
    author: { type: String, required: true },
    publishDate: { type: Date, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    contentBlocks: [NewsContentBlockSchema],
    isVisible: { type: Boolean, default: true },
    priority: { type: Number, default: 0 },
    relatedSlugs: [{ type: String }],
    seo: {
      title: { type: String },
      description: { type: String },
      keywords: { type: String },
    },
    sourceUrl: { type: String, default: "" },
    toc: [NewsTocEntrySchema],
  },
  { timestamps: true }
);

NewsArticleSchema.index({ isVisible: 1, priority: 1, publishDate: -1, createdAt: -1 });
NewsArticleSchema.index({ isVisible: 1, category: 1, priority: 1, publishDate: -1 });

export default mongoose.models.NewsArticle ||
  mongoose.model<INewsArticle>("NewsArticle", NewsArticleSchema);
