import React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { headers } from "next/headers";

const Footer: React.FC = async () => {
  const pathname = (await headers()).get("x-invoke-path") || ""; // Adjust this to how you're setting it up

  const yearInFooter = () => {
    const thisYear = new Date().getFullYear();

    return thisYear;
  };

  return (
    <footer className="bg-background border-t border-border px-4 py-4 lg:py-6">
      <div className="w-full flex flex-col md:flex-row items-center justify-between">
        <div className="hidden md:flex items-center gap-2 mb-4 md:mb-0">
          <ShoppingCart />
          <span className="sr-only">Stick To It</span>
        </div>

        <div className="flex w-full md:hidden flex-wrap items-center  md:justify-start mb-4 md:mb-0 ">
          <ul className="flex w-full justify-between text-2xl px-4 md:px-0">
            {routes.map((route) => {
              const LinkIcon = route.icon;

              return (
                <Link
                  key={route.id}
                  href={route.href}
                  className={cn(
                    "flex items-center bg-transparent gap-3 rounded-lg  transition-all hover:text-primary cursor-pointer",
                    {
                      "bg-muted text-foreground": pathname === route.pathName,
                    },
                  )}
                >
                  <LinkIcon />
                </Link>
              );
            })}
          </ul>
        </div>

        <div>
          <p className="text-sm text-secondary-foreground mt-8 md:mt-0 text-center">
            &copy; {yearInFooter()} by Nemanja Karaklajic
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
