import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/validation/auth";
import { registerType } from "@/types/register";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const body = (await request.json()) as registerType;
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 },
      );
    }

    const { email, name, password } = validation.data; //extract data from validation to use it

    const checkEmailIfExist = await prisma.user.findUnique({
      where: { email: email },
    });

    if (checkEmailIfExist) {
      return NextResponse.json(
        { message: "Email already exist" },
        { status: 400 },
      );
    }

    //hash password before saving to database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: hashedPassword,
      },
      select: {
        //to not return password field
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return NextResponse.json(
      { ...newUser },
      {
        status: 201,
      },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 },
    );
  }
};
