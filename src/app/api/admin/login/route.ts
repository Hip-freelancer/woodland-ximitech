import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminSessionCookieOptions,
  normalizeAdminNextPath,
  verifyAdminCredentials,
} from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const username = String(body?.username ?? "").trim();
    const password = String(body?.password ?? "");
    const nextPath = normalizeAdminNextPath(body?.next);

    if (!verifyAdminCredentials(username, password)) {
      return NextResponse.json(
        { error: "Tên đăng nhập hoặc mật khẩu không đúng." },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(
      ADMIN_SESSION_COOKIE,
      createAdminSessionToken(),
      getAdminSessionCookieOptions()
    );

    return NextResponse.json({ next: nextPath, success: true });
  } catch {
    return NextResponse.json(
      { error: "Không thể đăng nhập lúc này." },
      { status: 500 }
    );
  }
}
