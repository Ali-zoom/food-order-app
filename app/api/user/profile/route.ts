import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import axios from "axios";
import { updateProfileSchema } from "@/lib/validation/updateUserProfileSchema";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();

    const result = updateProfileSchema.safeParse(
      Object.fromEntries(formData.entries()),
    );
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Data not valid , validation error" },
        { status: 400 },
      );
    }

    const data = result.data;

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 401 });
    }
    const name = data.name;
    const email = data.email;
    const phone = data.phone;
    const streetAddress = data.streetAddress;
    const postalCode = data.postalCode;
    const city = data.city;
    const country = data.country;
    const role = data.role;

    const imageFile = formData.get("image") as File; //always get the iamge from formData not from validate
    const imageUrl =
      imageFile && imageFile.size > 0
        ? await saveFile(imageFile, "profile_images")
        : undefined;
    console.log(imageFile);
    console.log(imageUrl);

    await prisma.user.update({
      where: { email: email },
      data: {
        name,
        email,
        phone,
        streetAddress,
        postalCode,
        city,
        country,
        role,
        image: imageUrl ?? user?.image,
      },
    });
    // Revalidate ALL relevant paths
    revalidatePath("/profile");
    revalidatePath("/admin");
    revalidatePath("/");

    return NextResponse.json({ success: true, message: "ok" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "unacpected error accured" },
      { status: 500 },
    );
  }
};

// const getImageUrl = async (imageFile: File) => {
//   const formData = new FormData();
//   formData.append("image", imageFile);
//   formData.append("pathName", "profile_images");

//   try {
//     const response = await axios.post(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       },
//     );

//     const url = await response.data.imageUrl;
//     return url;
//   } catch (error) {
//     console.error("Error uploading file to server:", error);
//   }
// };

export async function saveFile(file: File, pathName: string) {
  // ✅ type check
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  // ✅ size check (2MB)
  const MAX_SIZE = 2 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error("File too large (max 2MB)");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.type.split("/")[1];
  const fileName = `${randomUUID()}.${ext}`;

  const filePath = path.join(
    process.cwd(),
    `public/uploads/${pathName}/`,
    fileName,
  );

  // ✅ ensure folder exists
  await mkdir(path.dirname(filePath), { recursive: true });

  await writeFile(filePath, buffer);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const imageUrl = `${baseUrl}/uploads/${pathName}/${fileName}`;

  return imageUrl;
}
