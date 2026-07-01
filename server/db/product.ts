import { cache } from "@/lib/cache";
import prisma from "@/lib/prisma";

export const getBestSellers = cache(
  (limite?: number | undefined) => {
    const bestSellers = prisma.product.findMany({
      where: {
        orders: {
          some: {},
        },
      },

      orderBy: {
        orders: {
          _count: "desc",
        },
      },
      include: {
        sizes: true,
        extras: true,
      },
      take: limite,
    });

    return bestSellers;
  },
  ["best-sellers"],
  { revalidate: 3600 },
);

export const getProductsByCategory = cache(
  () => {
    const productsByCategory = prisma.category.findMany({
      include: {
        products: {
          include: {
            sizes: true,
            extras: true,
          },
        },
      },
    });

    return productsByCategory;
  },
  ["products-by-category"],
  { revalidate: 3600 },
);

export const getProducts = cache(
  () => {
    const products = prisma.product.findMany({
      orderBy: {
        order: "asc",
      },
    });
    return products;
  },
  ["all-products"],
  { revalidate: 3600 },
);

export const getSingleProduct = cache(
  (id: string) => {
    const product = prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        sizes: true,
        extras: true,
      },
    });
    return product;
  },
   [`product-${crypto.randomUUID()}`],
  { revalidate: 3600 },
);
