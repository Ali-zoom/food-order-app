import { Product } from "@/app/generated/prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const MenuItems = ({ products }: { products: Product[] }) => {
  return products && products.length > 0 ? (
    <ul className="grid grid-cols-3 gap-4 sm:max-w-[625px] mx-auto">
      {products.map((product) => (
        <li
          key={product.id}
          className="bg-gray-100 hover:bg-gray-200 duration-200 transition-colors rounded-md"
        >
          <Link
            href={`/admin/menu-items/${product.id}/edit`}
            className="flex  flex-col items-center justify-center  py-4"
          >
            <Image
              src={product.image}
              alt={product.name}
              width={100}
              height={100}
              className=" object-scale-down"
            />

            <h3 className=" text-lg text-accent font-medium">{product.name}</h3>
          </Link>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-accent text-center">no Products Found</p>
  );
};

export default MenuItems;
