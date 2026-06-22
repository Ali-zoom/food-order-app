
import { getProducts, getSingleProduct } from "@/server/db/product";
import { productWithRelation } from "@/types/products";
import React from "react";

export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product) => ({ productid: product.id }));
}

interface IProps {
  params: Promise<{
    productid: string;
  }>,
  
}
const EditProductPage = async ({ params }: IProps) => {
  const { productid } = await params;
  const product:productWithRelation | null=await getSingleProduct(productid);
  if(!product)return <div>product not found</div>
  return (
   <div>ccc</div>
  );
};

