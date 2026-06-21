"use client";

import { buttonVariants } from "@/components/ui/button";
import { Pages, Routes } from "@/constants/enums";
import Link from "next/link";
import { usePathname } from "next/navigation";

function AdminTabs() {
  const pathname = usePathname();

  const tabs = [
    {
      id: crypto.randomUUID(),
      title: "profile",
      href: Routes.ADMIN,
    },
    {
      id: crypto.randomUUID(),
      title: "categories",
      href: `${Routes.ADMIN}/${Pages.CATEGORIES}`,
    },
    {
      id: crypto.randomUUID(),
      title: "menuItems",
      href: `${Routes.ADMIN}/${Pages.MENU_ITEMS}`,
    },
    {
      id: crypto.randomUUID(),
      title: "users",
      href: `${Routes.ADMIN}/${Pages.USERS}`,
    },
    {
      id: crypto.randomUUID(),
      title: "orders",
      href: `${Routes.ADMIN}/${Pages.ORDERS}`,
    },
  ];
  const isActiveTab = (href: string) => {
    return pathname === `/${href}`;
  };
  return (
    <nav className="mt-20">
      <ul className="flex items-center flex-wrap gap-4 justify-center">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <Link
              href={`/${tab.href}`}
              className={`hover:text-white! ${
                isActiveTab(tab.href)
                  ? buttonVariants({ variant: "default" })
                  : buttonVariants({ variant: "outline" })
              }`}
            >
              {tab.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default AdminTabs;
