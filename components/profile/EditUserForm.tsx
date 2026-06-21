"use client";
import React, { use, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import { Input } from "../ui/input";
import Image from "next/image";
import { Session } from "next-auth";
import {
  updateProfileSchema,
  updateProfilInput,
} from "@/lib/validation/updateUserProfileSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@/app/generated/prisma/enums";
import { CameraIcon } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import { usePathname, useRouter } from "next/navigation";
import { useClientSession } from "@/hooks/useClientSession";
import { useSession } from "next-auth/react";

const EditUserForm = ({
  user,
  initialSession,
}: {
  user: Session["user"];
  initialSession: Session | null;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const imageToShow = selectedImage ?? user.image ?? null;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // const [selectedImage, setSelectedImage] = useState(
  //     "https://www.mcgill.ca/web-services/files/web-services/styles/hd/public/marco-xu-toupbco62lw-unsplash_cropped.jpg?itok=vnN8-uiS&timestamp=1708957693",
  //   );
  const [isAdmin, setIsAdmin] = useState(user.role === UserRole.ADMIN);

  // const session = useClientSession(initialSession);
  const { update } = useSession();

  // if (session.data?.user.role !== UserRole.ADMIN) {
  //   // router.push("/profile");
  //   router.refresh();
  // }

  // if (session.data?.user.role !== UserRole.USER) {
  //   // router.push("/admin");
  //   router.refresh();
  // }

  const {
    register,
    handleSubmit,
    setError,

    formState: { errors },
  } = useForm<updateProfilInput>({
    mode: "onChange",
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone ?? undefined,
      streetAddress: user.streetAddress || undefined,
      postalCode: user.postalCode || undefined,
      city: user.city || undefined,
      country: user.country || undefined,
      role: user.role,
    },
  });

  const onSubmit = async (data: updateProfilInput) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone || "");
    formData.append("streetAddress", data.streetAddress || "");
    formData.append("postalCode", data.postalCode || "");
    formData.append("city", data.city || "");
    formData.append("country", data.country || "");
    formData.append("role", isAdmin ? UserRole.ADMIN : UserRole.USER);

    // ✅ file
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    await axios.post("/api/user/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("user profile updated", { position: "top-center" });
    await update();
    router.refresh();
  };

  console.log("selectedImage", selectedImage);
  return (
    <div className="flex flex-col md:flex-row  gap-10">
      <div className="flex flex-col items-center gap-5 w-[250px] h-[250px]  mx-auto">
        <div className="group relative w-[200px] h-[200px] overflow-hidden rounded-full">
          {imageToShow && (
            <Image
              src={imageToShow}
              alt={user.name}
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

      {/* user form data */}
      <div className="flex-1 ">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  readOnly
                  placeholder="example@email.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-destructive">{errors.email.message}</p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>

                <Input
                  id="name"
                  type="name"
                  placeholder="enter name"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-destructive">{errors.name.message}</p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <Input
                  id="phone"
                  type="number"
                  placeholder="0780000000"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-destructive">{errors.phone.message}</p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="streetAddress">StreetAddress</FieldLabel>
                <Input
                  id="streetAddress"
                  type="streetAddress"
                  placeholder="streetAddress"
                  {...register("streetAddress")}
                />
                {errors.streetAddress && (
                  <p className="text-destructive">
                    {errors.streetAddress.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="postalCode">PostalCode</FieldLabel>
                <Input
                  id="postalCode"
                  type="postalCode"
                  placeholder="postalCode"
                  {...register("postalCode")}
                />
                {errors.postalCode && (
                  <p className="text-destructive">
                    {errors.postalCode.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="city">City</FieldLabel>
                <Input
                  id="city"
                  type="city"
                  placeholder="city"
                  {...register("city")}
                />
                {errors.city && (
                  <p className="text-destructive">{errors.city.message}</p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="country">Country</FieldLabel>
                <Input
                  id="country"
                  type="country"
                  placeholder="country@email.com"
                  {...register("country")}
                />
                {errors.country && (
                  <p className="text-destructive">{errors.country.message}</p>
                )}
              </Field>
              {user.role === UserRole.ADMIN && (
                <Field>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="isAdmin"
                      name="isAdmin"
                      checked={isAdmin}
                      onClick={() => setIsAdmin(!isAdmin)}
                    />

                    <FieldLabel htmlFor="isAdmin">isAdmin</FieldLabel>
                  </div>
                </Field>
              )}
            </FieldGroup>
            <Button className="w-full">save</Button>
          </FieldSet>
        </form>
      </div>
    </div>
  );
};

export default EditUserForm;

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
