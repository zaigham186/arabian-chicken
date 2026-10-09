import { NextRequest, NextResponse } from "next/server";
import {
  checkLoginRateLimit,
  safeEqual,
  signAdminToken,
  setAdminCookie,
  ADMIN_PASSWORD,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  if (!checkLoginRateLimit(ip)) {
    return NextResponse.json({ error: "Too many attempts, try later" }, { status: 429 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const password = typeof body?.password === "string" ? body.password : "";

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    if (!safeEqual(password, ADMIN_PASSWORD)) {
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }

    const token = signAdminToken();
    const res = NextResponse.json({ token, ok: true });
    setAdminCookie(res, token);

    return res;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
