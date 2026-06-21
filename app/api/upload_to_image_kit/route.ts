import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
  } catch (error) {
    console.log(error);

    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}

export async function saveFileToImageKit(file: File, pathName: string) {
  try {
    if (!file) {
      return {
        success: false,
        message: "No file uploaded",
      };
    }

    // ==========
    // ===============
    // Validate file type
    // =========================

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        message: "Invalid file type",
      };
    }

    // =========================
    // Validate file size (2MB)
    // =========================

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
      return {
        success: false,
        message: "File size must be less than 2MB",
      };
    }

    // =========================
    // Convert file to buffer
    // =========================

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    // =========================
    // Upload to ImageKit
    // =========================

    const uploadedFile = await imagekit.upload({
      file: buffer,
      fileName: file.name,
      folder: `/${pathName}`,
    });

    // console.log("uploadedFile", uploadedFile);

    return {
      success: true,
      url: uploadedFile.url,
      fileId: uploadedFile.fileId,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Upload failed",
    };
  }
}
