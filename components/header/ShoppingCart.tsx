"use client";
import { getCartItemsQuantity } from "@/lib/cart";
import { selectCartItems } from "@/redux/features/cartSlice";
import { useAppSelector } from "@/redux/hooks";
import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const ShoppingCart = () => {
  const cart = useAppSelector(selectCartItems);
  const cartItemsQuantity = getCartItemsQuantity(cart);
  return (
    <Link className="relative block group" href={"/cart"}>
      <span className="absolute -top-4 inset-s-4 w-5 h-5  bg-primary rounded-full text-center text-white text-sm ">
        {cartItemsQuantity}
      </span>
      <ShoppingCartIcon
        className={`text-accent group-hover:text-primary duration-200 transition-colors w-6! h-6!`}
      />
    </Link>
  );
};

export default ShoppingCart;
