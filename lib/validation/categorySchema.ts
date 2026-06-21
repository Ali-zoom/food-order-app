import z from "zod";

const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Category Name is required")
    .max(255, "Name is too long"),
});
export type CategoryInput = z.infer<typeof categorySchema>;

export default categorySchema;
