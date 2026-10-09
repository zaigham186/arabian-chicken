import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, unauthorizedResponse } from "@/lib/auth";
import { getCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return unauthorizedResponse();
  }

  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!file || typeof file === "string" || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "Please choose a valid image (jpg, png, webp, avif)" },
        { status: 400 },
      );
    }

    // Check size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 },
      );
    }

    // Check MIME type
    if (!/^image\/(jpeg|png|webp|avif|gif)$/i.test(file.type)) {
      return NextResponse.json(
        { error: "Please choose a valid image (jpg, png, webp, avif)" },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const c = getCloudinary();
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      c.uploader
        .upload_stream({ folder: "arabian-chick" }, (err, res) => {
          if (err || !res) return reject(err || new Error("Upload failed"));
          resolve(res);
        })
        .end(buffer);
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
