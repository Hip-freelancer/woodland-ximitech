import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import NewsArticle from "@/models/NewsArticle";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") ?? "10");

    const articles = await NewsArticle.find()
      .sort({ publishDate: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ data: articles });
  } catch {
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
