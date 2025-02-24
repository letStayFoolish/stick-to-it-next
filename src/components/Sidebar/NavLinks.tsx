"use client";

import React from "react";
import { routes } from "@/lib/routes";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const NavLinks: React.FC = () => {
  const pathname = usePathname();
  return (
    <>
      {routes.map((route) => {
        const LinkIcon = route.icon;

        return (
          <Link
            key={route.id}
            href={route.href}
            className={cn(
              "mx-[-0.65rem] flex items-center bg-transparent text-muted-foreground gap-4 px-4 py-2 mb-4 hover:text-foreground",
              (pathname === route.pathName ||
                route.pathName.startsWith("/products")) &&
                "font-bold text-black hover:text-opacity-80 dark:text-white border-b-2 border-primary",
            )}
          >
            <LinkIcon />
            {route.pageName as string}
          </Link>
        );
      })}
    </>
  );
};

export default NavLinks;
