import { z } from "zod";
export const registerSchema = z.object({
  name: z.string().nonempty("Name is required").min(2, "user at list 2 char"),
  email: z.email("invalid email").nonempty("email is required"),
  password: z
    .string()

    .nonempty("password is required")
    .min(4, "password at list 4 char"),
});

export type registerInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email("invalid email").nonempty("email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ✅ Type inference (this is why Zod is powerful)
export type LoginInput = z.infer<typeof loginSchema>;
