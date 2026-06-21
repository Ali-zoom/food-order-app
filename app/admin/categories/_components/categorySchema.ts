import z from "zod";

const categorySchema = z.object({
  name: z.string().min(2, "Name is required").max(255, "Name is too long"),
});
export type CategoryInput = z.infer<typeof categorySchema>;

const editCategorySchema = z.object({
  id: z.string().min(1, "id is required"),
  editname: z.string().min(2, "Name is required").max(255, "Name is too long"),
});
export type EditCategoryInput = z.infer<typeof editCategorySchema>;

export { editCategorySchema, categorySchema };
