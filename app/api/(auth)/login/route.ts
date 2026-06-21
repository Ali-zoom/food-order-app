import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { loginSchema } from "@/lib/validation/auth";

type LoginType = z.infer<typeof loginSchema>;

export const POST = async (request: NextRequest) => {
  try {
    const body = (await request.json()) as LoginType;

    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          type: "validationError",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });
    // check if user exist
    if (!user) {
      return NextResponse.json(
        {
          type: "authError",
          error: "Invalid email or password",
        },
        { status: 400 },
      );
    }
    // compare password and check if match
    const checkHashedPassword = await bcrypt.compare(
      body.password,
      user.password,
    );
    if (!checkHashedPassword) {
      return NextResponse.json(
        { type: "authError", errors: "Invalid email or password" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Login successful", user },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        type: "serverError",
        error: "internal server error",
      },
      { status: 500 },
    );
  }
};
