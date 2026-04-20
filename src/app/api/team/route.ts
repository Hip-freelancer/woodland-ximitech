import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import TeamMember from "@/models/TeamMember";

export async function GET() {
  try {
    await connectToDatabase();
    const members = await TeamMember.find().sort({ order: 1 }).lean();
    return NextResponse.json({ data: members });
  } catch {
    return NextResponse.json({ error: "Failed to fetch team" }, { status: 500 });
  }
}
