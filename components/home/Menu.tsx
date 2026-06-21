"use client";
import { formatCurrency } from "@/lib/formatter";
import Image from "next/image";
import AddToCard from "./AddToCard";
import { productWithRelation } from "@/types/products";
import { useAppSelector } from "@/redux/hooks";
import { selectCartItems } from "@/redux/features/cartSlice";
import { getSingleCartItemQuantity } from "@/lib/cart";

const Menu = ({ products }: { products: productWithRelation[] }) => {
  const cart = useAppSelector(selectCartItems);
  return products?.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-4 ">
      {products.map((item, index) => (
        <div
          key={index}
          className="p-6 rounded-lg text-center bg-slate-50
        group hover:bg-white hover:shadow-md hover:shadow-black/25 transition-all"
        >
          <div className="relative mx-auto w-48 h-48">
            <Image
              className="object-cover"
              src={item.image}
              alt={item.name}
              fill
            />
          </div>
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-lg">{item.name}</h1>
            <p className="text-accent font-bold">
              {formatCurrency(item.basePrice)}
            </p>
          </div>
          <p className="text-accent font-bold text-center mt-4 line-clamp-3">
            {item.description}
          </p>
          <AddToCard item={item} />
        </div>
      ))}
    </div>
  ) : (
    <p className="text-center w-full font-bold text-accent">no items found</p>
  );
};

export default Menu;
