


import { cache } from "@/lib/cache";
import prisma from "@/lib/prisma";
import { Session } from "next-auth";

export const getOrders = cache(
  (session: Session) => {
    const orders = prisma.order.findMany({
         where:{userEmail:session?.user.role!=="ADMIN"? session?.user.email: {}},
      orderBy: {
        createdAt: "desc",
      },
      include:{
        products:{include:{product:true}}
      }
      
    });

    return orders;
  },
  ["get-orders"],
  { revalidate: 120 },
);