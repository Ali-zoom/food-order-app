import prisma from "@/lib/prisma";
import categorySchema, { CategoryInput } from "@/lib/validation/categorySchema";
import { NextRequest, NextResponse } from "next/server";

// export const dynamic = "force-dynamic";// if i want no catching
export const dynamic = "force-static";

import { cache } from "@/lib/cache";
import { revalidatePath } from "next/cache";
import { revalidateTag } from "next/cache";
//get all categories (cached)
export const GET = async (request: NextRequest) => {
  try {
    const categories = await getAllCategories();
    console.log("DB HIT");
    return NextResponse.json(
      { categories: categories },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("GET all Category:", error);

    return NextResponse.json(
      { message: "Failed to fetch categories" },
      { status: 500 },
    );
  }
};

export const getAllCategories = cache(
  () => {
    const categories = prisma.category.findMany({
      orderBy: { order: "asc" },
    });

    return categories;
  },
  ["getCategories"],
  { revalidate: 120, tags: ["getCategories"] },
);

export const POST = async (request: NextRequest) => {
  try {
    const body = (await request.json()) as CategoryInput;

    const result = categorySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          message: result.error.issues[0].message,
        },
        { status: 400 },
      );
    }
    // check if category exist
    const isExists = await prisma.category.findFirst({
      where: { name: result.data.name },
    });

    if (isExists) {
      return NextResponse.json(
        {
          message: "category name alrady exists",
        },
        { status: 400 },
      );
    }

    const category = await prisma.category.create({
      data: { name: result.data.name },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/menu");
    return NextResponse.json(
      {
        message: "created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "internal server error",
      },
      { status: 500 },
    );
  }
};
