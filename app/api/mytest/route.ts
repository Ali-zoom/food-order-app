// export const dynamic = "force-dynamic";// if i want no catching
export const dynamic = "force-static";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { cache } from "@/lib/cache";

export const GET = async (request: NextRequest) => {
  try {
    const users = await getAllUsers();
    console.log("DB HIT");
    return NextResponse.json(users, {
      status: 200,
    });
  } catch (error) {
    console.error("GET all users:", error);

    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 },
    );
  }
};

export const getAllUsers = cache(
  () => {
    const getUsers = prisma.user.findMany({});

    return getUsers;
  },
  ["getUsers"],
  { revalidate: 120, tags: ["getUsers"] },
);
