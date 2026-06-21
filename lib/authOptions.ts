import { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import prisma from "@/lib/prisma";
import { loginAction } from "@/server/actions/loginAction";
import { User, UserRole } from "@/app/generated/prisma/client";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends Partial<User> {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const res = await loginAction(credentials);
        if (res.success && res.user) {
          return res.user;
        }

        if (res.success === false) {
          throw new Error(
            JSON.stringify({
              validationError: res.errors,
              authError: res.error,
            }),
          );
        }

        // if (!credentials?.email || !credentials?.password) {
        //   throw new Error("Missing credentials");
        // }

        // const user = await prisma.user.findUnique({
        //   where: { email: credentials.email },
        // });

        // if (!user) {
        //   throw new Error("User not found");
        // }

        // const isValid = await bcrypt.compare(
        //   credentials.password,
        //   user.password,
        // );

        // if (!isValid) {
        //   throw new Error("Invalid password");
        // }

        // return {
        //   id: user.id.toString(),
        //   name: user.name,
        //   email: user.email,
        //   role: user.role,
        // };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt: async ({ token }): Promise<JWT> => {
      console.log("token id ", token.id);
      const dbUser = await prisma.user.findUnique({
        where: { email: token.email },
      });
      if (!dbUser) {
        return token;
      }
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        image: dbUser.image,
        city: dbUser.city,
        country: dbUser.country,
        phone: dbUser.phone,
        postalCode: dbUser.postalCode,
        streetAddress: dbUser.streetAddress,
      };
    },
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.image = token.image as string;
        session.user.country = token.country as string;
        session.user.city = token.city as string;
        session.user.postalCode = token.postalCode as string;
        session.user.streetAddress = token.streetAddress as string;
        session.user.phone = token.phone as string;
      }
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          name: token.name,
          email: token.email,
          role: token.role,
          image: token.image,
        },
      };
    },
  },
};
