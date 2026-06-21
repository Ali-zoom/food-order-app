import { cache } from "@/lib/cache";
import prisma from "@/lib/prisma";

export const getCategories = cache(
  () => {
    const productsByCategory = prisma.category.findMany({
      orderBy: {
        order: "asc",
      },
    });

    return productsByCategory;
  },
  ["get-categories"],
  { revalidate: 120 },
);
