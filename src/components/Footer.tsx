import React from "react";
import Link from "next/link";
import { FaHome, FaList } from "react-icons/fa";
import { FaCartShopping, FaUserLarge } from "react-icons/fa6";
import { ShoppingCart } from "lucide-react";

const Footer: React.FC = () => {
  const session = { user: "Nemanja Karaklajic" };

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
          {session && (
            <ul className="flex w-full justify-between text-2xl">
              <li className="hover:text-primary">
                <Link href={"/"}>
                  <FaHome />
                </Link>
              </li>
              <li className="hover:text-primary">
                <Link href={"/products"}>
                  <FaList />
                </Link>
              </li>
              <li className="hover:text-primary">
                <Link href={"/shopping-list"}>
                  <FaCartShopping />
                </Link>
              </li>
              <li className="hover:text-primary">
                <Link href={"/profile"}>
                  <FaUserLarge />
                </Link>
              </li>
            </ul>
          )}
        </div>

        <div>
          <p className="text-sm text-secondary-foreground mt-2 md:mt-0 text-center">
            &copy; {yearInFooter()} by Nemanja Karaklajic
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
