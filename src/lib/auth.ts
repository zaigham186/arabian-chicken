import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = process.env["JWT_SECRET"] || "default-secret-change-in-prod";
const ADMIN_PASSWORD = process.env["ADMIN_PASSWORD"] || "";

export function safeEqual(a: string, b: string): boolean {
  const x = crypto.createHash("sha256").update(String(a)).digest();
  const y = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
}

export function signAdminToken(): string {
  return jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAdminToken(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) return false;
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export function unauthorizedResponse(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
