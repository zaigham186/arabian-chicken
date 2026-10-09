import { NextRequest, NextResponse } from "next/server";
import { connectDB, Item } from "@/lib/db";
import { verifyAdminToken, unauthorizedResponse } from "@/lib/auth";
import { cleanItem, isValidObjectId } from "@/lib/validation";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: NextRequest, context: RouteContext) {
  if (!verifyAdminToken(req)) {
    return unauthorizedResponse();
  }

  const { id } = await context.params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    await connectDB();
    const body = await req.json().catch(() => ({}));
    const keys = Object.keys(body);

    // Fast toggle for sold out/available
    if (keys.length === 1 && keys[0] === "available") {
      const updated = await Item.findOneAndUpdate(
        { _id: id },
        { available: Boolean(body.available) },
        { returnDocument: "after" },
      );
      if (!updated) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json(updated);
    }

    const { data, error } = cleanItem(body);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const updated = await Item.findOneAndUpdate({ _id: id }, data, {
      returnDocument: "after",
    });
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PUT /api/items/[id] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  if (!verifyAdminToken(req)) {
    return unauthorizedResponse();
  }

  const { id } = await context.params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    await connectDB();
    await Item.findOneAndDelete({ _id: id });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("DELETE /api/items/[id] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
