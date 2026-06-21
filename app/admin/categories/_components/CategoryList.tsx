"use client";
import { DeleteIcon, Edit2Icon, Trash2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { EditCategory } from "./EditCategory";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Category } from "@/app/generated/prisma/client";
import { useRouter } from "next/navigation";

const CategoryList = ({ categories }: { categories: Category[] }) => {
  const handelDeleteCategory = async (id: string) => {
    console.log("delete category with id:", id);
    try {
      const res = await axios.delete(`/api/categories/${id}`);
      console.log(res.data.message);
      toast.success(res.data.message, { position: "top-center" });
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message, {
          position: "top-center",
          className:
            "!bg-red-500 !text-white !border !border-red-700 !rounded-xl !shadow-lg",
        });
        console.log(error.response?.data);
        console.log(error.message);
      } else {
        toast.error("Unknown error", {
          position: "top-center",
          className:
            "!bg-red-500 !text-white !border !border-red-700 !rounded-xl !shadow-lg",
        });
        console.log("Unknown error", error);
      }
    }
  };
  const router = useRouter();

  return (
    <div>
      <p>Category List</p>
      {categories?.map((category) => (
        <div
          key={category.id}
          className="bg-gray-300 p-4 my-2 rounded-md flex justify-between"
        >
          <p className="flex-1 text-start">{category.name}</p>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => handelDeleteCategory(category.id)}
            >
              <Trash2Icon
                size={20}
                className="text-destructive cursor-pointer text-sm"
              />
            </Button>
            <EditCategory category={category} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
