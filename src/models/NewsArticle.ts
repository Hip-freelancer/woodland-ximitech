import mongoose, { Schema, Document } from "mongoose";

export interface INewsArticle extends Document {
  title: string;
  content: string;
  excerpt: string;
  image: string;
  author: string;
  publishDate: Date;
  slug: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const NewsArticleSchema = new Schema<INewsArticle>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    image: { type: String, required: true },
    author: { type: String, required: true },
    publishDate: { type: Date, required: true },
    slug: { type: String, required: true, unique: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.NewsArticle ||
  mongoose.model<INewsArticle>("NewsArticle", NewsArticleSchema);
