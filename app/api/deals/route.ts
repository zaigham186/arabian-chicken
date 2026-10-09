import { NextRequest, NextResponse } from "next/server";
import { connectDB, Deal } from "@/lib/db";
import { verifyAdminToken, unauthorizedResponse } from "@/lib/auth";
import { cleanDeal, slugify } from "@/lib/validation";

export async function GET() {
  try {
    await connectDB();
    const deals = await Deal.find().sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json(deals);
  } catch (error: any) {
    console.error("GET /api/deals error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return unauthorizedResponse();
  }

  try {
    await connectDB();
    const body = await req.json().catch(() => ({}));
    const { data, error } = cleanDeal(body);

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const slug = `${slugify(data.title)}-${Date.now()}`;
    const created = await Deal.create({ ...data, slug });

    return NextResponse.json(created);
  } catch (error: any) {
    console.error("POST /api/deals error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
