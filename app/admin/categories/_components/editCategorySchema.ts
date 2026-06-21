import z from "zod";

const editCategorySchema = z.object({
  editName: z.string().min(2, "Name is required").max(255, "Name is too long"),
});
export type EditCategoryInput = z.infer<typeof editCategorySchema>;

export default editCategorySchema;
