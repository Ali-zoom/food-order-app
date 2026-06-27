import { z } from "zod";
export const checkoutSchema = z.object({
  name: z.string().min(1, "name required"),
  email: z.email().min(1).trim(),
  phone: z.string().min(11, "invalida phone number"),
  city: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  notes: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
