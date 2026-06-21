"use server";

import { loginSchema } from "@/lib/validation/auth";
import axios from "axios";

export async function loginAction(
  data: Record<"email" | "password", string> | undefined,
) {
  // ✅ validate again (server safety)
  const result = loginSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const res = await axios.post(
      "http://localhost:3000/api/login",
      result.data,
    );

    return { success: true, user: res?.data.user };
  } catch (error: any) {
    if (error?.response?.data.type === "validationError") {
      return {
        success: false,
        error: error.response.data.errors,
      };
    } else if (error?.response?.data.type === "authError") {
      return {
        success: false,
        error: error.response.data.error,
      };
    } else {
      return {
        success: false,
        error: error.response.data.error || "An unexpected error occurred",
      };
    }
  }
}
