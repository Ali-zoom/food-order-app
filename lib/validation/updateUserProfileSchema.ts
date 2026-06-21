import { z } from "zod";
export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, { message: "name required" }),
  email: z.email({ message: "invald email" }).trim(),
  phone: z.string().trim().optional(),

  streetAddress: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  role: z.enum(["ADMIN", "USER"]),
  image: z.custom((val) => val instanceof File).optional(),
});
// ✅ Type inference (this is why Zod is powerful)
export type updateProfilInput = z.infer<typeof updateProfileSchema>;
