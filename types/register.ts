import { z } from "zod";
import { registerSchema } from "@/lib/validation/auth";

export type registerType = z.infer<typeof registerSchema>;
