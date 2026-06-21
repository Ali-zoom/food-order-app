import { Prisma } from "@/app/generated/prisma/client";

export type productWithRelation = Prisma.ProductGetPayload<{
  include: {
    sizes: true;
    extras: true;
  };
}>;
