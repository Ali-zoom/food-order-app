import { z } from "zod";
export const addProuductSchema = z.object({
  itemName: z.string().trim().min(1, { message: "name required" }),
  description: z
    .string()
    .trim()
    .min(5, { message: "description at least 5 char" }),
  basePrice: z.string().min(1, "Price is required"),
  // categoryId: z.string().min(1, "category Id is required"),
  // image: z
  //   .instanceof(File, {
  //     message: "Product image required",
  //   })
  //   .refine((file) => file.size <= 2 * 1024 * 1024, {
  //     message: "Image size must be less than 2MB",
  //   })
  //   .refine(
  //     (file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
  //     {
  //       message: "Only JPEG, PNG, and GIF files are allowed",
  //     },
  //   ),
  //for optional image
  // image: z
  //   .instanceof(File)
  //   .refine((file) => file.size <= 2 * 1024 * 1024, {
  //     message: "Image size must be less than 2MB",
  //   })
  //   .refine(
  //     (file) =>
  //       ["image/jpeg", "image/png", "image/gif"].includes(file.type),
  //     {
  //       message: "Only JPEG, PNG, and GIF files are allowed",
  //     },
  //   )
  //   .optional(),
});
// ✅ Type inference (this is why Zod is powerful)
export type addProuductInput = z.infer<typeof addProuductSchema>;
