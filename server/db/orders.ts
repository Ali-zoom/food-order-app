


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


export const getSingleOrder = cache(
  (id: string) => {
    const orders = prisma.order.findUnique({
         where:{id:id},
     
      include:{
        products:{include:{product:true}}
      }
      
    });

    return orders;
  },
   [`order-${crypto.randomUUID()}`],
  { revalidate: 120 },
);