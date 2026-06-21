"use client";
import { Category } from "@/app/generated/prisma/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { EditCategoryInput, editCategorySchema } from "./categorySchema";

export function EditCategory({ category }: { category: Category }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditCategoryInput>({
    resolver: zodResolver(editCategorySchema),
    mode: "onChange",
    defaultValues: {
      editname: category.name,
    },
  });

  const handelUpdateCategory = async (id: string, editName: string) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/categories/${id}`,
        {
          editName: editName,
        },
      );
      toast.success("Category updated successfully");
      reset();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update category");
    }
  };

  const onSubmit = async (data: EditCategoryInput) => {
    await handelUpdateCategory(
      "9804fab1-7bcd-4be6-868d-54016eabb915",
      data.editname,
    );
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Edit category"
        >
          <Edit2Icon size={20} className="text-green" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Make changes to your category here.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label htmlFor="editName">Name</Label>
              <Input id="editName" {...register("editname")} />
            </Field>

            {errors.editname && (
              <p className="text-sm text-destructive text-start">
                {errors.editname.message}
              </p>
            )}
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
