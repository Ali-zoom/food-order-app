import {
  EditCategoryInput,
  editCategorySchema,
} from "@/app/admin/categories/_components/categorySchema";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

interface IParamsProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * @method PUT
 * @route /api/categories/:id
 * @description update a single category by ID
 * @access private (only logined user and whome posted the post  can update a post )
 */
/**
 * @method PUT
 * @route /api/categories/:id
 * @description update a single category by ID
 * @access private (only logined user and whome posted the post  can update a post )
 */
export const PUT = async (request: NextRequest, { params }: IParamsProps) => {
  try {
    const { id } = await params;

    const isExists = await prisma.category.findUnique({ where: { id: id } });
    if (!isExists) {
      return NextResponse.json(
        { message: "Category Not Found" },
        { status: 404 },
      );
    }
    const data = (await request.json()) as EditCategoryInput;

    console.log("data is =======", data.editname);
    const result = editCategorySchema.safeParse(data);
    if (!result.success) {
      return NextResponse.json(
        { message: result.error.issues[0].message },
        { status: 400 },
      );
    }

    const updatedCategory = await prisma.category.update({
      where: { id: id },
      data: {
        name: result.data.editname,
      },
    });

    return NextResponse.json(
      { message: "Category updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 },
    );
  }
};
/**
 * @method DELETE
 * @route /api/categories/:id
 * @description delete a single category by ID
 * @access private (only logined user and whome posted the post  can delete a post )
 */
export const DELETE = async (
  request: NextRequest,
  { params }: IParamsProps,
) => {
  try {
    const { id } = await params;

    const isExists = await prisma.category.findUnique({ where: { id: id } });
    if (!isExists) {
      return NextResponse.json(
        { message: "Category Not Found" },
        { status: 404 },
      );
    }

    const deletedCategory = await prisma.category.delete({
      where: { id: id },
    });
    revalidatePath("/admin/categories");
    revalidatePath("/menu");
    return NextResponse.json(
      { message: "category deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log("error is ====", error);
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 },
    );
  }
};
