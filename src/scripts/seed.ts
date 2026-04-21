import mongoose from "mongoose";
import * as dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

// Import Models
import "@/models/Product";
import "@/models/Category";
import "@/models/NewsArticle";
import "@/models/Project";
import "@/models/TeamMember";

// Import mock data
import { ALL_PRODUCTS, NEWS_ARTICLES } from "../lib/staticData";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log("Connected to MongoDB");

    const CategoryModel = mongoose.models.Category;
    const ProductModel = mongoose.models.Product;
    const NewsArticleModel = mongoose.models.NewsArticle;

    console.log("Clearing existing data...");
    await CategoryModel.deleteMany({});
    await ProductModel.deleteMany({});
    await NewsArticleModel.deleteMany({});
    console.log("Existing data cleared.");

    console.log("Seeding Categories...");
    const uniqueCategories = Array.from(new Set(ALL_PRODUCTS.map(p => p.category)));
    for (const [index, cat] of uniqueCategories.entries()) {
      await CategoryModel.create({
        name: { en: cat, vi: `${cat} (Tiếng Việt)` },
        slug: cat.toLowerCase().replace(/\s+/g, '-'),
        priority: index,
        isVisible: true,
        seo: { title: cat, description: `Explore our ${cat} products`, keywords: cat.toLowerCase() }
      });
    }
    
    console.log("Seeding Products...");
    for (const [index, p] of ALL_PRODUCTS.entries()) {
      await ProductModel.create({
        name: { en: p.name, vi: p.name + " (VN)" },
        series: p.series,
        slug: p.slug,
        description: { en: p.description, vi: "Mô tả: " + p.description },
        grade: { en: p.grade, vi: p.grade },
        category: p.category.toLowerCase().replace(/\s+/g, '-'), // using slug as reference
        thickness: p.thickness,
        material: { en: p.material, vi: p.material },
        bonding: { en: p.bonding, vi: p.bonding },
        dimensions: p.dimensions,
        image: p.image,
        galleryImages: p.galleryImages,
        certifications: p.certifications,
        availability: { en: p.availability, vi: p.availability === "In Stock" ? "Còn Hàng" : "Hết Hàng" },
        specifications: p.specifications || [],
        applications: p.applications || [],
        featured: p.featured,
        priority: index,
        isVisible: true,
        seo: { title: p.name, description: p.description, keywords: p.slug.split('-').join(', ') },
      });
    }

    console.log("Seeding News Articles...");
    for (const [index, a] of NEWS_ARTICLES.entries()) {
      await NewsArticleModel.create({
        title: { en: a.title, vi: a.title + " (Bản tiếng Việt)" },
        content: { en: a.excerpt, vi: a.excerpt + " (Nội dung chi tiết tiếng Việt)" },
        excerpt: { en: a.excerpt, vi: a.excerpt + " (Tóm tắt tiếng Việt)" },
        category: "industry",
        image: a.image,
        author: a.author,
        publishDate: new Date(a.publishDate),
        slug: a.slug,
        tags: a.tags,
        priority: index,
        isVisible: true,
        seo: { title: a.title, description: a.excerpt, keywords: a.tags.join(', ') },
      });
    }

    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
