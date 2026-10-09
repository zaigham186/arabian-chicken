import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ ok: true, database: "connected" });
  } catch (error: any) {
    return NextResponse.json({ ok: true, database: "disconnected", error: error?.message });
  }
}
