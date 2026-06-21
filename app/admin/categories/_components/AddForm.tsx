"use client";
import React from "react";
import { CategoryInput } from "./categorySchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FaRegAddressCard } from "react-icons/fa6";
import { LucideNewspaper } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import categorySchema from "@/lib/validation/categorySchema";
import { useRouter } from "next/navigation";

const AddCategoryForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    mode: "onChange",
  });

  const onSubmit = async (data: CategoryInput) => {
    try {
      const res = await axios.post("/api/categories", {
        name: data.name,
      });
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

  return (
    <div className="">
      <Card className="w-full ">
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
          <CardDescription>
            Enter the details for the new category.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="form-rhf-demo" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full flex items-center gap-4 ">
              <div className="flex-1">
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter category name"
                  {...register("name")}
                />
              </div>

              <Button className="p-4" type="submit" form="form-rhf-demo">
                <LucideNewspaper />
              </Button>
            </div>
            {errors.name && (
              <p className="text-sm text-destructive text-start">
                {errors.name.message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCategoryForm;
