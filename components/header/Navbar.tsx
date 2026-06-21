"use client";
import Link from "next/link";
import React, { useState } from "react";
import { IoClose, IoMenu } from "react-icons/io5";
import AuthButtons from "./AuthButtons";
import { Session } from "next-auth";
import { useClientSession } from "@/hooks/useClientSession";
import { UserRole } from "@/app/generated/prisma/enums";
import { usePathname } from "next/navigation";
interface INavProps {
  initialSession: Session | null;
}
const Navbar = ({ initialSession }: INavProps) => {
  const session = useClientSession(initialSession);
  const isAdmin = session?.data?.user.role === UserRole.ADMIN;
  const path = usePathname();
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <nav className=" flex-1 justify-end md:justify-between flex    ">
      <button onClick={() => setOpenMenu(true)} className=" lg:hidden ">
        <IoMenu size={25} />
      </button>
      <ul
        className={` fixed lg:static
        
        ${openMenu ? "left-0 z-50" : "-left-full"}
        
        top-0 px-10 py-20 lg:p-0 bg-background lg:bg-transparent transition-all duration-200 h-full lg:h-auto flex-col lg:flex-row w-full lg:w-auto flex items-start lg:items-center gap-10`}
      >
        <button
          onClick={() => setOpenMenu(false)}
          className="lg:hidden ml-auto p-1 bg-blue-50 rounded shadow"
        >
          <IoClose size={25} />
        </button>
        <li>
          <Link
            className="hover:text-primary duration-200 transition-colors font-semibold text-accent"
            href={"/menu"}
          >
            Menu
          </Link>
        </li>
        <li>
          <Link
            className="hover:text-primary duration-200 transition-colors font-semibold text-accent"
            href={"/about"}
          >
            About
          </Link>
        </li>
        <li>
          <Link
            className="hover:text-primary duration-200 transition-colors font-semibold text-accent"
            href={"/"}
          >
            Contact
          </Link>
        </li>

        {/* admin or profile link */}
        {session?.data?.user && (
          <li>
            <Link
              className={`hover:text-primary duration-200 transition-colors font-semibold text-accent ${path.startsWith("/admin") || path.startsWith("/profile") ? "text-primary" : "text-accent"}`}
              href={`${isAdmin ? "/admin" : "/profile"}`}
            >
              {isAdmin ? "Admin" : "profile"}
            </Link>
          </li>
        )}

        {/* end admin or profile link */}
        <li className="block lg:hidden">
          <AuthButtons initialSession={initialSession} />
        </li>
      </ul>
      <div className="hidden lg:block  ">
        <AuthButtons initialSession={initialSession} />
      </div>
    </nav>
  );
};

export default Navbar;
