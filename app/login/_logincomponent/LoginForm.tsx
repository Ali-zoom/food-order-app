"use client";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validation/auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
const LoginForm = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="w-full mx-w-md h-full flex flex-col items-center justify-center">
        <div>
          <h1>Login Form</h1>
        </div>

        <FieldInput />
      </div>
    </div>
  );
};

export default LoginForm;

export function FieldInput() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    mode: "onChange",
    resolver: zodResolver(loginSchema),
  });
  const router = useRouter();
  const onSubmit = async (data: LoginInput) => {
    console.log(data);
    const signInData = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (signInData?.error) {
      type FieldErrors = Record<string, string[]>;
      const validationError: FieldErrors = JSON.parse(
        signInData.error,
      ).validationError;

      if (validationError) {
        Object.entries(validationError).forEach(([field, messages]) => {
          if (messages && messages.length > 0) {
            setError(field as keyof LoginInput, {
              type: "server",
              message: messages[0] as string, // take first error message
            });
          }
        });
      }
      const authError = JSON.parse(signInData?.error).authError;
      if (authError) {
        toast.error(authError, { position: "top-center" });
      }
    } else {
      //redirect to homePage
      router.replace("/");
    }
  };
  return (
    <form className="w-full max-w-xs" onSubmit={handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Username</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-destructive">{errors.email.message}</p>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>

            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-destructive">{errors.password.message}</p>
            )}
          </Field>
        </FieldGroup>
        <Button className="w-full">login</Button>
      </FieldSet>
    </form>
  );
}
