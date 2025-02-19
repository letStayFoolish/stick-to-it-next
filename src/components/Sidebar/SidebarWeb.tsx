import React from "react";
import Link from "next/link";
import LogOutBtn from "@/components/LogOutBtn";
import { verifySession } from "@/lib/dal";
import { LogOut } from "lucide-react";
import NavLinks from "@/components/Sidebar/NavLinks";

const SidebarWeb: React.FC = async () => {
  const session = await verifySession();

  return (
    <nav className="px-2 text-lg font-medium lg:px-4">
      <div className="mb-6 px-2">
        <NavLinks />
      </div>

      <div className="mb-6 text-center flex flex-col gap-1 justify-center">
        {session ? (
          <LogOutBtn
            btnVariant="outline"
            className="text-lg py-6 flex items-center"
          >
            <LogOut /> Sign out
          </LogOutBtn>
        ) : (
          <Link
            href={"/login"}
            className="bg-card-foreground text-primary-foreground rounded-md text-lg px-3 py-2"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default SidebarWeb;
