import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const { fullName, email, phone, company, message } = body;

    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: "Full name, email, and message are required" },
        { status: 400 }
      );
    }

    const contact = await Contact.create({
      fullName,
      email,
      phone,
      company,
      message,
    });

    return NextResponse.json({ data: contact }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 }
    );
  }
}
