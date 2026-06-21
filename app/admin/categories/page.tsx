import React from "react";
import AddCategoryForm from "./_components/AddForm";
import CategoryList from "./_components/CategoryList";
import { getCategories } from "@/server/db/categories";

const Categories = async () => {
  const categories = await getCategories();
  return (
    <section className="container">
      <div className=" sm:max-w-lg mx-auto space-y-6 ">
        <h1 className="text-2xl py-4 font-bold text-center ">Category Page</h1>

        <AddCategoryForm />

        <CategoryList categories={categories} />
      </div>
    </section>
  );
};

export default Categories;
