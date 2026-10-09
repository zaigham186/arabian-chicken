import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, unauthorizedResponse } from "@/lib/auth";
import { getCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import { isValidImageBuffer } from "@/lib/validation";

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return unauthorizedResponse();
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json({ error: "Image storage service is not configured" }, { status: 503 });
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

    // Enforce 5MB file-size limit
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 });
    }

    // Enforce MIME type
    if (!/^image\/(jpeg|png|webp|avif|gif)$/i.test(file.type)) {
      return NextResponse.json(
        { error: "Please choose a valid image (jpg, png, webp, avif)" },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Deep content validation: verify actual image magic bytes
    if (!isValidImageBuffer(buffer)) {
      return NextResponse.json({ error: "Invalid image file content" }, { status: 400 });
    }

    const c = getCloudinary();
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      c.uploader
        .upload_stream({ folder: "arabian-chick", resource_type: "image" }, (err, res) => {
          if (err || !res) return reject(err || new Error("Upload failed"));
          resolve(res);
        })
        .end(buffer);
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error: any) {
    console.error("Upload error:", error?.message || "Unknown error");
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
