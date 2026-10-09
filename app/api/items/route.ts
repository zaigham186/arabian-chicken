import { NextRequest, NextResponse } from "next/server";
import { connectDB, Item } from "@/lib/db";
import { verifyAdminToken, unauthorizedResponse } from "@/lib/auth";
import { cleanItem, slugify } from "@/lib/validation";

export async function GET() {
  try {
    await connectDB();
    const items = await Item.find().sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json(items);
  } catch (error: any) {
    console.error("GET /api/items error:", error);
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
    const { data, error } = cleanItem(body);

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const slug = `${slugify(data.name)}-${Date.now()}`;
    const created = await Item.create({ ...data, slug });

    return NextResponse.json(created);
  } catch (error: any) {
    console.error("POST /api/items error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
