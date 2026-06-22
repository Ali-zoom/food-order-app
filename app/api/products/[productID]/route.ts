// export const dynamic = "force-dynamic";// if i want no catching
export const dynamic = "force-static";
import prisma from "@/lib/prisma";
import { updateProuductSchema } from "@/lib/validation/addProductsSchema";
import { NextRequest, NextResponse } from "next/server";
import { Extra, Size } from "@/app/generated/prisma/client";
import { ExtraIngradiends, productSizes } from "@/constants/enums";
import { revalidatePath } from "next/cache";
import { saveFileToImageKit } from "../../upload_to_image_kit/route";
interface Iparams {
  params: Promise<{
    productID: string;
  }>;
}
export const PUT = async (request: NextRequest, { params }: Iparams) => {
  try {
    const { productID } = await params;
    const product = await prisma.product.findUnique({
      where: { id: productID },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "product not found" },
        { status: 400 },
      );
    }
    const formData = await request.formData();

    const result = updateProuductSchema.safeParse(
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
    let imageUpload;
    //check if user upload image
    if (imageFile && imageFile.size > 0) {
      imageUpload =
        imageFile && imageFile.size > 0
          ? await saveFileToImageKit(imageFile, "products")
          : undefined;

      if (!imageUpload?.success) {
        return NextResponse.json(
          { success: false, message: imageUpload?.message },
          { status: 400 },
        );
      }
    }

    if (categoryId) {
      await prisma.product.update({
        where: {
          id: productID,
        },
        data: {
          name,
          description,
          basePrice,
          categoryId,
          image: imageUpload ? imageUpload.url : product.image,
        },
      });

      await prisma.size.deleteMany({
        where: {
          productId: productID,
        },
      });

      await prisma.size.createMany({
        data: sizes.map((size) => ({
          productId: productID,
          name: size.name as productSizes,
          price: Number(size.price ?? "0"),
        })),
      });

      await prisma.extra.deleteMany({
        where: {
          productId: productID,
        },
      });

      await prisma.extra.createMany({
        data: extras.map((extra) => ({
          productId: productID,
          name: extra.name as ExtraIngradiends,
          price: Number(extra.price ?? "0"),
        })),
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
