import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogOut, Menu, ShoppingCart } from "lucide-react";
import Link from "next/link";
import LogOutBtn from "@/components/LogOutBtn";
import { verifySession } from "@/lib/dal";
import { Button } from "@/components/ui/button";
import NavLinks from "@/components/Sidebar/NavLinks";

const SidebarMobile: React.FC = async () => {
  const session = await verifySession();

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
          <SheetTitle>{``}</SheetTitle>
        </SheetHeader>
        {/* ================================================ */}
        {/* MOBILE SIDEBAR MENU*/}
        <nav className="h-full flex flex-col justify-between gap-2 text-lg font-medium">
          <div>
            <Link
              href="/"
              className="flex items-center gap-4 text-lg font-semibold mb-8"
            >
              <ShoppingCart /> {"Stick To It"}
              <span className="sr-only">{"Stick To It"}</span>
            </Link>
            <div className="mb-16">
              <NavLinks />
            </div>
          </div>
          <div className="mb-6 text-center flex flex-col gap-2 justify-center">
            {session ? (
              <LogOutBtn btnVariant="default" className="text-lg">
                <LogOut /> Sign Out
              </LogOutBtn>
            ) : (
              <Link
                href={"/login"}
                className="bg-stone-950 dark:bg-stone-700 text-accent dark:text-white rounded-md text-lg px-3 py-2"
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
