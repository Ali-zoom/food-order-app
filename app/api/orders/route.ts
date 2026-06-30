
// export const dynamic = "force-dynamic";// if i want no catching
export const dynamic = "force-static";import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {
  CheckoutFormValues,
  checkoutSchema,
} from "@/lib/validation/checkoutFormSchema";
import prisma from "@/lib/prisma";
import { OrderStatus, PaymentMethod } from "@/constants/enums";
import { authOptions } from "@/lib/authOptions";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = checkoutSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          message: result.error.issues[0].message,
        },
        { status: 400 },
      );
    }

    //   const session = await getServerSession(authOptions);
    //   if (!session?.user?.email) {
    //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    //   }

    const { name, email, phone, city, country, notes } = result.data;
    // const products = body.products as { productId: string; quantity: number; userId?: string }[];
    const products = JSON.parse(body.products as string) as {
      id: string;
      quantity: number;
      userId?: string;
    }[];

    console.log("this products array", products);
    // const products:{ productId: string; quantity: number; userId?: string }[] = JSON.parse(body.products));
    const order = await prisma.order.create({
      data: {
        userEmail: email,

        phone,
        streetAddress: body.streetAddress,
        postalCode: body.postalCode,
        city: city ?? "",
        country: country ?? "",
        subTotal: body.subTotal,
        deliveryFee: body.deliveryFee,
        totalPrice: body.totalPrice,
        paid: false,
        status: OrderStatus.PENDING,
        paymentMethod: PaymentMethod.PAY_ON_DELIVERY,
        // products: {
        //   create: products.map(
        //     (p: { productId: string; quantity: number; userId: string }) => ({
        //       productId: p.productId,
        //       quantity: p.quantity,
        //       userId: p.userId ?? null,
        //     }),
        //   ),
        // },

        products: {
          createMany: {
            data: products.map((p) => ({
              productId: p.id,
              quantity: p.quantity,
              userId:body.userId ?? null,
            })),
          },
        },
      },
      include: {
        products: { include: { product: true } },
      },
    });
revalidatePath("/admin/orders");
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      {
        message: "internal server error",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  // const session = await getServerSession(authOptions);
  // if (!session?.user?.email ||  session.user.role !== "ADMIN") {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  const orders = await prisma.order.findMany({
    // where: { userEmail: session.user.email },
    orderBy: { createdAt: "desc" },
    include: {
      products: { include: { product: true } },
    },
  });

  return NextResponse.json(orders,{status:200});
}
