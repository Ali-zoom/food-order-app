import { Prisma } from "@/app/generated/prisma/client";

export type OrderWithRelation = Prisma.OrderGetPayload<{
  include: {
    products: {
      include: {
        product: true;
      };
    };
  };
}>;
