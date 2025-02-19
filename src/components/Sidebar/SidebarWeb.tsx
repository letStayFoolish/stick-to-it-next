import React from "react";
import { routes } from "@/lib/routes";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { headers } from "next/headers";
import LogOutBtn from "@/components/LogOutBtn";
import { verifySession } from "@/lib/dal";
import { LogOut } from "lucide-react";

const SidebarWeb: React.FC = async () => {
  const session = await verifySession();

  // Get current pathname from headers (available in server context)
  const pathname = (await headers()).get("x-invoke-path") || ""; // Adjust this to how you're setting it up

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

      <div className="mb-6 text-center flex flex-col gap-2 justify-center">
        {session ? (
          <LogOutBtn
            btnVariant="default"
            className="flex justify-center items-center"
          >
            <LogOut /> Sign Out
          </LogOutBtn>
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
  );
};

export default SidebarWeb;
