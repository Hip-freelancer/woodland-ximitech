import { NextRequest, NextResponse } from "next/server";
import { fetchProductMenu } from "@/lib/content";
import type { Locale } from "@/types";

function resolveLocale(value: string | null): Locale {
  return value === "vi" ? "vi" : "en";
}

export async function GET(req: NextRequest) {
  try {
    const locale = resolveLocale(req.nextUrl.searchParams.get("locale"));
    const data = await fetchProductMenu(locale);

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch product menu" },
      { status: 500 }
    );
  }
}
