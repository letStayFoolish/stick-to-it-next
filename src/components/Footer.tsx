"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const Footer: React.FC = () => {
  const pathname = usePathname();

  const activeIndex = routes.findIndex((route) =>
    route.pathName === "/"
      ? pathname === "/"
      : pathname.startsWith(route.pathName),
  );

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

        <div className="w-full md:hidden mb-4 md:mb-0 rounded-2xl border border-border bg-card p-1.5 shadow-soft">
          <div className="relative flex w-full">
            {activeIndex >= 0 && (
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 rounded-xl bg-accent/55 transition-transform duration-300 ease-out"
                style={{
                  width: `${100 / routes.length}%`,
                  transform: `translateX(${activeIndex * 100}%)`,
                }}
              />
            )}
            <ul className="relative z-10 flex w-full text-2xl">
              {routes.map((route) => {
                const LinkIcon = route.icon;
                const isActive = route.id === routes[activeIndex]?.id;

                return (
                  <li key={route.id} className="flex flex-1 justify-center">
                    <Link
                      href={route.href}
                      aria-label={route.pageName as string}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-center gap-3 rounded-xl py-2 px-3 transition-colors hover:text-foreground cursor-pointer",
                        isActive ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      <LinkIcon />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
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
