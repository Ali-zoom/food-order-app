// export const dynamic = "force-dynamic";// if i want no catching
export const dynamic = "force-static";
import prisma from "@/lib/prisma";
import { addProuductSchema } from "@/lib/validation/addProductsSchema";
import { NextRequest, NextResponse } from "next/server";
import { saveFileToImageKit } from "../upload_to_image_kit/route";
import { Extra, Size } from "@/app/generated/prisma/client";
import { ExtraIngradiends, productSizes } from "@/constants/enums";
import { revalidatePath } from "next/cache";

export const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();

    const result = addProuductSchema.safeParse(
      Object.fromEntries(formData.entries()),
    );
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.flatten().fieldErrors },
        // { success: false, message: "Data not valid , validation error" },
        { status: 400 },
      );
    }

    const data = result.data;

    const name = data.itemName;
    const description = data.description;
    const basePrice = Number(data.basePrice);

    const sizes: Partial<Size>[] = JSON.parse(formData.get("sizes") as string);
    const extras: Partial<Extra>[] = JSON.parse(
      formData.get("extras") as string,
    );

    const categoryId = formData.get("categoryId") as string;

    const imageFile = formData.get("image") as File; //always get the iamge from formData not from validate
    const imageUpload =
      imageFile && imageFile.size > 0
        ? await saveFileToImageKit(imageFile, "products")
        : undefined;

    if (!imageUpload?.success) {
      return NextResponse.json(
        { success: false, message: imageUpload?.message },
        { status: 400 },
      );
    }
    if (categoryId) {
      await prisma.product.create({
        data: {
          name,
          description,
          basePrice,
          categoryId,
          image: imageUpload.url!,
          sizes: {
            createMany: {
              data: sizes.map((size) => ({
                name: size.name as productSizes,
                price: Number(size.price ?? "0"),
              })),
            },
          },
          extras: {
            createMany: {
              data: extras.map((extra) => ({
                name: extra.name as ExtraIngradiends,
                price: Number(extra.price ?? "0"),
              })),
            },
          },
        },
      });
    }

    // Revalidate ALL relevant paths
    revalidatePath("/admin");

    revalidatePath("/");
    revalidatePath("/menu");
    revalidatePath("/admin/menu-items");

    return NextResponse.json({ success: true, message: "ok" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "unacpected error accured" },
      { status: 500 },
    );
  }
};
