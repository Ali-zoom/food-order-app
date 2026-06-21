// app/api/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get("image") as File;
    const pathName = data.get("pathName");

    // ✅ Validate file exists
    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 },
      );
    }

    // ✅ Validate type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Only image files allowed" },
        { status: 400 },
      );
    }

    // ✅ Validate size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "File too large (max 2MB)" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ✅ Unique name
    const ext = file.type.split("/")[1];
    const fileName = `${randomUUID()}.${ext}`;

    const filePath = path.join(
      process.cwd(),
      `public/uploads/${pathName}/`,
      fileName,
    );

    await writeFile(filePath, buffer);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const imageUrl = `${baseUrl}/uploads/${pathName}/${fileName}`;

    return NextResponse.json({
      success: true,
      fileName,
      imageUrl,
    });
  } catch (error: any) {
    console.error("Upload error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while uploading",
      },
      { status: 500 },
    );
  }
}
