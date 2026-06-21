"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoginForm from "./_logincomponent/LoginForm";

const LoginPage = () => {
  const router = useRouter();
  const handeLogin = async () => {
    const signInData = await signIn("credentials", {
      email: "ali@email.com",
      password: "1234",
      redirect: false,
    });

    if (signInData?.error) {
      console.log("error is =============", signInData.error);
      const validationError = JSON.parse(signInData?.error).validationError;
      console.log("valdateionError========", validationError);

      const authError = JSON.parse(signInData?.error).authError;
      console.log("authError========", authError);
    } else {
      //redirect to homePage
      router.replace("/");
    }
  };
  return (
    <div className="container">
      <button onClick={handeLogin}>login </button>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
