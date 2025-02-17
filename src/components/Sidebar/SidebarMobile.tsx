"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogOut, Menu, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const SidebarMobile: React.FC = () => {
  const pathname = usePathname();

  const { data: session } = useSession();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>
        {/* ================================================ */}
        {/* MOBILE SIDEBAR MENU*/}
        <nav className="grid gap-2 text-lg font-medium">
          <Link
            href="/"
            className="flex items-center gap-4 text-lg font-semibold mb-8"
          >
            <ShoppingCart /> {"Stick To It"}
            <span className="sr-only">{"Stick To It"}</span>
          </Link>
          <div className="mb-16">
            {routes.map((route) => {
              const LinkIcon = route.icon;

              return (
                <Link
                  key={route.id}
                  href={route.href}
                  className={cn(
                    "mx-[-0.65rem] mb-2 flex items-center bg-background text-muted-foreground gap-4 rounded-xl px-4 py-3 hover:text-foreground",
                    { "bg-muted text-foreground": pathname === route.pathName },
                  )}
                >
                  <LinkIcon />
                  {route.pageName as string}
                </Link>
              );
            })}
          </div>
          <div className="mb-6 text-center flex flex-col gap-2 justify-center">
            {session ? (
              <Button
                className="text-sm flex justify-start items-center gap-4 px-3 py-2"
                onClick={() => signOut()}
              >
                <LogOut /> Sign Out
              </Button>
            ) : (
              <Link
                href={"/login"}
                className="bg-stone-950 dark:bg-stone-700 text-accent dark:text-white rounded-md text-sm flex justify-start items-center gap-4 px-3 py-2"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default SidebarMobile;
