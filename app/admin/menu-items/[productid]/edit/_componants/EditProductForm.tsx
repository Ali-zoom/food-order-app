"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Session } from "next-auth";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CameraIcon } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { useClientSession } from "@/hooks/useClientSession";
import { useSession } from "next-auth/react";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Category, Extra, Size } from "@/app/generated/prisma/client";
import {
  addProuductInput,
  addProuductSchema,
} from "@/lib/validation/addProductsSchema";
import SelectItems from "./SelectItems";
import Sizes from "./Sizes";
import Extras from "./Extras";
import React from 'react'

const EditProductForm = () => {
   const [selectedValue, setSelectedValue] = useState(categories[0].id);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const imageToShow = selectedImage ?? null;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // const [selectedImage, setSelectedImage] = useState(
  //     "https://www.mcgill.ca/web-services/files/web-services/styles/hd/public/marco-xu-toupbco62lw-unsplash_cropped.jpg?itok=vnN8-uiS&timestamp=1708957693",
  //   );
  const [sizes, setSizes] = useState<Partial<Size>[]>([]);
  const [extras, setExtras] = useState<Partial<Extra>[]>([]);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,

    formState: { errors },
  } = useForm<addProuductInput>({
    mode: "onChange",
    resolver: zodResolver(addProuductSchema),
    defaultValues: {},
  });

  const onSubmit = async (data: addProuductInput) => {
    if (!selectedFile || selectedFile === null) {
      setImageError("no file choosen");
      return;
    }

    if (imageError) {
      return;
    }

    if (!selectedValue || selectedValue === undefined) {
      return;
    }

    const formData = new FormData();

    formData.append("itemName", data.itemName);
    formData.append("description", data.description);
    formData.append("basePrice", data.basePrice);
    formData.append("categoryId", selectedValue);
    formData.append("sizes", JSON.stringify(sizes));
    formData.append("extras", JSON.stringify(extras));

    // ✅ file
    if (selectedFile) {
      formData.append("image", selectedFile);
    }
    try {
      await axios.post("/api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("product added", { position: "top-center" });
      router.push("/admin/menu-items");
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
    <div className="flex flex-col md:flex-row  gap-10">
      <div className="flex flex-col items-center gap-5 w-[250px] h-[250px]  mx-auto">
        <div className="group relative w-[200px] h-[200px] overflow-hidden rounded-full">
          {imageToShow && (
            <Image
              src={imageToShow}
              alt="kkk"
              width={200}
              height={200}
              className="rounded-full object-cover "
            />
          )}

          <div
            className={`
      absolute inset-0 z-10 flex items-center justify-center
      bg-gray-50/40
      transition-opacity duration-200
      ${imageToShow ? "opacity-0 group-hover:opacity-100" : "opacity-200"}
    `}
          >
            <UploadImage
              setSelectedImage={setSelectedImage}
              setSelectedFile={setSelectedFile}
              setImageError={setImageError}
              imageError={imageError}
            />
          </div>
        </div>
        <small className="text-sm text-destructive">
          {imageError && imageError}
        </small>
      </div>

      {/* product form data */}
      <div className="flex-1  ">
        <form
          onSubmit={handleSubmit(onSubmit, (errors) =>
            console.log("❌ Validation failed:", errors),
          )}
          className="grid gap-3 "
        >
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="itemName">Item Name</FieldLabel>
                <Input
                  id="itemName"
                  type="text"
                  placeholder="enter item name"
                  {...register("itemName")}
                />
                {errors.itemName && (
                  <p className="text-destructive">{errors.itemName.message}</p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>

                <Input
                  id="description"
                  type="text"
                  placeholder="enter description"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="basePrice">Item Price</FieldLabel>
                <Input
                  id="basePrice"
                  type="number"
                  min={0}
                  {...register("basePrice")}
                />
                {errors.basePrice && (
                  <p className="text-destructive">{errors.basePrice.message}</p>
                )}
              </Field>
              <Field>
                <SelectItems
                  categories={categories}
                  selectedValue={selectedValue}
                  setSelectedValue={setSelectedValue}
                />
              </Field>

              <Field className="w-100 ">
                <FieldLabel htmlFor="sizes">Sizes</FieldLabel>
                <Sizes sizes={sizes} setSizes={setSizes} />
              </Field>

              <Field className="w-100 ">
                <FieldLabel htmlFor="extras">Extras</FieldLabel>
                <Extras extras={extras} setExtras={setExtras} />
              </Field>
            </FieldGroup>

            <Button className="w-full">save</Button>
          </FieldSet>
        </form>
      </div>
    </div>
  );
}

export default EditProductForm

const UploadImage = ({
  setSelectedImage,
  setSelectedFile,
  setImageError,
  imageError,
}: {
  setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  setImageError: React.Dispatch<React.SetStateAction<string | null>>;
  imageError: string | null;
}) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setImageError("Max file size is 2MB");
        return;
      } else {
        setImageError(null);
      }

      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      setSelectedFile(file);
    }
  };
  return (
    <>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="image-upload"
        onChange={handleImageChange}
        name="image"
      />
      <label
        htmlFor="image-upload"
        className="border rounded-full w-[200px] h-[200px] flex items-center justify-center cursor-pointer"
      >
        <CameraIcon className="w-8! h-8! text-accent" />
      </label>
    </>
  );
};
