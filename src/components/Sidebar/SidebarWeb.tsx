"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/routes";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const SidebarWeb: React.FC = () => {
  const pathname = usePathname();

  const session = true;
  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      <div className="mb-6">
        {routes.map((route) => {
          const LinkIcon = route.icon;

          return (
            <Link
              key={route.id}
              href={route.href}
              className={cn(
                "flex items-center bg-transparent text-muted-foreground gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary cursor-pointer",
                {
                  "bg-muted text-foreground": pathname === route.pathName,
                },
              )}
            >
              <LinkIcon />
              {route.pageName as string}
            </Link>
          );
        })}
      </div>
      {/*/!*<SignIn />*!/ via Google*/}
      <div className="mb-6 text-center flex flex-col gap-2 justify-center">
        <Link
          href={"/login"}
          className="bg-green-500 rounded-md text-sm flex justify-start items-center gap-4 px-3 py-2"
        >
          Login
        </Link>
        <Link
          href={"/register"}
          className="bg-green-500 rounded-md text-sm flex justify-start items-center gap-4 px-3 py-2"
        >
          Register
        </Link>
      </div>

      {/*{session ? null : <LoginButton />}*/}
      {!session ? null : (
        <Button
          className="text-sm flex justify-start items-center gap-4 px-3 py-2"
          // onClick={() => signOut()}
        >
          Sign Out
          {/*<LogOut /> {t("SignOut")}*/}
        </Button>
      )}
    </nav>
  );
};

export default SidebarWeb;
