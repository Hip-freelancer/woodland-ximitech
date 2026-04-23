import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const ADMIN_SESSION_COOKIE = "woodland_admin_session";
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 12;

function getAdminConfig() {
  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASS;
  const adminSessionSecret =
    process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASS;

  if (!adminUser || !adminPass || !adminSessionSecret) {
    throw new Error("Admin credentials are not configured correctly.");
  }

  return {
    adminPass,
    adminSessionSecret,
    adminUser,
  };
}

function signPayload(payload: string) {
  const { adminSessionSecret } = getAdminConfig();
  return createHmac("sha256", adminSessionSecret)
    .update(payload)
    .digest("base64url");
}

export function verifyAdminCredentials(username: string, password: string) {
  const { adminUser, adminPass } = getAdminConfig();
  return username === adminUser && password === adminPass;
}

export function createAdminSessionToken() {
  const { adminUser } = getAdminConfig();
  const expiresAt = Date.now() + ADMIN_SESSION_MAX_AGE * 1000;
  const payload = `${adminUser}:${expiresAt}`;
  const signature = signPayload(payload);

  return `${expiresAt}.${signature}`;
}

export function verifyAdminSessionToken(token?: string | null) {
  if (!token) {
    return false;
  }

  const [expiresAtRaw, signature] = token.split(".");
  const expiresAt = Number(expiresAtRaw);

  if (!signature || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    return false;
  }

  const { adminUser } = getAdminConfig();
  const payload = `${adminUser}:${expiresAt}`;
  const expectedSignature = signPayload(payload);
  const providedSignature = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);

  if (providedSignature.length !== expectedSignatureBuffer.length) {
    return false;
  }

  return timingSafeEqual(providedSignature, expectedSignatureBuffer);
}

export function isAdminRequestAuthenticated(
  request: Pick<NextRequest, "cookies">
) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSessionToken(token);
}

export function createAdminApiUnauthorizedResponse() {
  return NextResponse.json(
    { error: "Phiên đăng nhập quản trị không hợp lệ." },
    { status: 401 }
  );
}

export function getAdminSessionCookieOptions(maxAge = ADMIN_SESSION_MAX_AGE) {
  return {
    httpOnly: true,
    maxAge,
    path: "/",
    priority: "high" as const,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export function normalizeAdminNextPath(rawPath?: string | null) {
  if (!rawPath || !rawPath.startsWith("/admin")) {
    return "/admin";
  }

  if (rawPath.startsWith("/admin/login")) {
    return "/admin";
  }

  return rawPath;
}
