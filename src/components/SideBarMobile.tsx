"use client";

import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogOut, Menu, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";
import { usePathname } from "next/navigation";

const SideBarMobile: React.FC = () => {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
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

          {/*{session ? null : <LoginButton />}*/}
          {/*{!session ? null : (*/}
          <Button
            className="flex justify-start items-center gap-4"
            // onClick={() => signOut()}
          >
            <LogOut /> {"SignOut"}
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default SideBarMobile;
