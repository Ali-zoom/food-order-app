"use client";
import { useClientSession } from "@/hooks/useClientSession";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
const AuthButtons = ({
  initialSession,
}: {
  initialSession: Session | null;
}) => {
  const path = usePathname();
  const session = useClientSession(initialSession);
  return (
    <>
      {!session?.data && (
        <div className=" grid lg:flex items-center justify-center gap-6">
          <Link
            className={`hover:text-primary duration-200 transition-colors font-semibold ${path === "/login" ? "text-primary" : "text-accent"} `}
            href={"/login"}
          >
            Login
          </Link>

          <Link
            className="hover:text-primary text-white duration-200 transition-colors font-semibold text-accent px-6 py-2 rounded bg-primary"
            href={"/register"}
          >
            Register
          </Link>
        </div>
      )}

      {session?.data && (
        <button
          className=" text-white  hover:text-white duration-200 transition-colors font-semibold px-10 py-2 rounded-xl bg-primary"
          onClick={() =>
            signOut({
              callbackUrl: "/login",
            })
          }
        >
          logout
        </button>
      )}
    </>
  );
};

export default AuthButtons;
