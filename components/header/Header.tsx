import Link from "next/link";
import Navbar from "./Navbar";
import ShoppingCart from "./ShoppingCart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const Header = async () => {
  const initialSession = await getServerSession(authOptions);
  return (
    <header className="py-y md:py-6">
      <div className="container flex items-center justify-between space-x-10 ">
        <Link className="text-primary font-semibold text-2xl" href={"/"}>
          🍕 Pizza
        </Link>
        <Navbar initialSession={initialSession} />
        <ShoppingCart />
      </div>
    </header>
  );
};

export default Header;
