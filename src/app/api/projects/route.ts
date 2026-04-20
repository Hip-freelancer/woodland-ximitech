import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");

    const query: Record<string, unknown> = {};
    if (featured === "true") query.featured = true;

    const projects = await Project.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ data: projects });
  } catch {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
