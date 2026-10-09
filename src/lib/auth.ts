import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env["JWT_SECRET"] || "default-secret-change-in-prod";
const ADMIN_PASSWORD = process.env["ADMIN_PASSWORD"] || "";

export const COOKIE_NAME = "admin_token";
export const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export function safeEqual(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const x = crypto.createHash("sha256").update(a).digest();
  const y = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(x, y);
}

export function signAdminToken(): string {
  return jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
}

export function extractToken(req: NextRequest): { token: string | null; isCookie: boolean } {
  const authHeader = req.headers.get("authorization") || "";
  if (authHeader.startsWith("Bearer ")) {
    const t = authHeader.substring(7).trim();
    if (t) return { token: t, isCookie: false };
  } else if (authHeader.trim()) {
    return { token: authHeader.trim(), isCookie: false };
  }

  const cookieToken = req.cookies.get(COOKIE_NAME)?.value?.trim();
  if (cookieToken) {
    return { token: cookieToken, isCookie: true };
  }

  return { token: null, isCookie: false };
}

export function verifyCsrf(req: NextRequest): boolean {
  const method = req.method.toUpperCase();
  if (["GET", "HEAD", "OPTIONS"].includes(method)) return true;

  const origin = req.headers.get("origin");
  const host = req.headers.get("host");

  if (!origin || !host) {
    // If browser doesn't send origin (same-origin GET-transformed or non-cross-site), verify referer
    const referer = req.headers.get("referer");
    if (referer && host) {
      try {
        const refUrl = new URL(referer);
        return refUrl.host === host;
      } catch {
        return false;
      }
    }
    return true;
  }

  try {
    const originUrl = new URL(origin);
    return originUrl.host === host;
  } catch {
    return false;
  }
}

export function verifyAdminToken(req: NextRequest): boolean {
  const { token, isCookie } = extractToken(req);
  if (!token) return false;

  // Enforce CSRF protection for cookie-authenticated mutating requests
  if (isCookie && !verifyCsrf(req)) {
    return false;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    // Strict admin role verification
    return !!(decoded && typeof decoded === "object" && decoded.role === "admin");
  } catch {
    return false;
  }
}

export function setAdminCookie(res: NextResponse, token: string): void {
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export function clearAdminCookie(res: NextResponse): void {
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function unauthorizedResponse(message = "Unauthorized"): NextResponse {
  return NextResponse.json({ error: message }, { status: 401 });
}

/* ---------------- Rate Limiter for Login ---------------- */
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const loginRateLimits = new Map<string, RateLimitRecord>();

export function checkLoginRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 mins
  const maxAttempts = 10;

  // Cleanup old records to prevent unbounded memory growth
  if (loginRateLimits.size > 1000) {
    for (const [key, val] of loginRateLimits.entries()) {
      if (now > val.resetAt) loginRateLimits.delete(key);
    }
  }

  const record = loginRateLimits.get(ip);
  if (!record || now > record.resetAt) {
    loginRateLimits.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= maxAttempts) {
    return false;
  }

  record.count += 1;
  return true;
}

export { ADMIN_PASSWORD };
