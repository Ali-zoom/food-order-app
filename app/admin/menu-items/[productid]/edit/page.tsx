import { getProducts } from "@/server/db/product";
import React from "react";

export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product) => ({ productid: product.id }));
}

interface IProps {
  params: Promise<{
    productid: string;
  }>;
}
const EditProductPage = async ({ params }: IProps) => {
  const { productid } = await params;
  return <div>hello product {productid}</div>;
};

export default EditProductPage;
