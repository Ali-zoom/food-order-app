"use client";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import React from "react";

const TestPage = () => {
  //   const session = await getServerSession(authOptions);
  const { data: session, status } = useSession();
  return (
    <div>
      <button
        onClick={() =>
          signOut({
            redirect: true,
            callbackUrl: "/",
          })
        }
        className="divide-destructive"
      >
        sign out{" "}
      </button>

      <h1>{JSON.stringify(session)}</h1>
    </div>
  );
};

export default TestPage;
