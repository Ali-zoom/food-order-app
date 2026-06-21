import React from "react";
import FormAddProduct from "./_components/Form";
import { getCategories } from "@/server/db/categories";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRightCircle } from "lucide-react";
import { getProducts } from "@/server/db/product";
import MenuItems from "./_components/MenuItems";

const ItemsPage = async () => {
  const products = await getProducts();
  return (
    <main>
      <div className="container">
        <Link
          href="/admin/menu-items/new"
          className={`${buttonVariants({
            variant: "outline",
          })} mx-auto! flex! w-80! h-10! mb-8 mt-3`}
        >
          create New MenuItem
          <ArrowRightCircle className="w-5! h-5!" />
        </Link>

        <MenuItems products={products} />
      </div>
    </main>
  );
};

export default ItemsPage;
