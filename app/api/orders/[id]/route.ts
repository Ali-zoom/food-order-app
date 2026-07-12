// export const dynamic = "force-dynamic"; // if i want no catching
// export const dynamic = "force-static";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/authOptions";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  console.log("session==========", session);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { products: { include: { product: true } } },
  });

  if (!order || order.userEmail !== session.user.email) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}

interface Iprop {
  params: Promise<{
    id: string;
  }>;
}
export async function PUT(req: NextRequest, { params }: Iprop) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  console.log("Session user:", session?.user);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const order = await prisma.order.findUnique({ where: { id: id } });

  if (!order || order.userEmail !== session.user.email) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Only allow cancel if still PENDING
  if (order.status !== "PENDING") {
    return NextResponse.json(
      { error: "Order can no longer be cancelled" },
      { status: 400 },
    );
  }

  const updated = await prisma.order.update({
    where: { id: id },
    data: { status: "CANCELLED" },
  });
  revalidatePath(`/admin/orders`);
  revalidatePath(`/admin/orders/${id}`);

  return NextResponse.json(updated, { status: 200 });
}
