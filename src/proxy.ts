import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import {
  isAdminRequestAuthenticated,
  normalizeAdminNextPath,
} from "@/lib/adminAuth";

const intlMiddleware = createMiddleware(routing);

export default function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  
  if (url.pathname.startsWith('/admin')) {
    const isLoginPage = url.pathname === "/admin/login";
    const isAuthenticated = isAdminRequestAuthenticated(req);

    if (!isAuthenticated && !isLoginPage) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set(
        "next",
        normalizeAdminNextPath(`${url.pathname}${url.search}`)
      );

      return NextResponse.redirect(loginUrl);
    }

    if (isAuthenticated && isLoginPage) {
      const nextPath = normalizeAdminNextPath(url.searchParams.get("next"));
      return NextResponse.redirect(new URL(nextPath, req.url));
    }

    return NextResponse.next();
  }
  
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
