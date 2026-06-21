"use client";

import { SessionProvider } from "next-auth/react";

interface Props {
  children: React.ReactNode;
}

export const AuthProviders = ({ children }: Props) => {
  return <SessionProvider>{children}</SessionProvider>;
};
