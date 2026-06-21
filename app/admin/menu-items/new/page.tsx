import { getCategories } from "@/server/db/categories";
import React from "react";
import FormAddProduct from "../_components/Form";

const AddNewProduct = async () => {
  const categories = await getCategories();

  return (
    <div>
      <FormAddProduct categories={categories} />
    </div>
  );
};

export default AddNewProduct;
