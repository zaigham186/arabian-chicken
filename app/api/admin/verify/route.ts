import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, unauthorizedResponse } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return unauthorizedResponse("Invalid or expired session");
  }

  return NextResponse.json({ authenticated: true, role: "admin" });
}
