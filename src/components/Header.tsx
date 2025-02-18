import React from "react";
import SidebarMobile from "@/components/Sidebar/SidebarMobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ModeToggle from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { CircleUser } from "lucide-react";
import { headers } from "next/headers";

const Header: React.FC = async () => {
  // Get current pathname from headers (available in server context)
  const pathname = (await headers()).get("x-invoke-path") || ""; // Adjust this to how you're setting it up

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <SidebarMobile />
      <div className="w-full flex-1">{/*  PLACEHOLDER SEARCH INPUT*/}</div>
      <ModeToggle />
      {!isAuthPage && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
};

export default Header;
