import { FaHome, FaList } from "react-icons/fa";
import { FaCartShopping, FaUserLarge } from "react-icons/fa6";

export const routes = [
  {
    id: "1",
    href: "/",
    pageName: "Home",
    pathName: "/",
    icon: FaHome,
  },
  {
    id: "2",
    href: "/products",
    pageName: "Products",
    pathName: "/products",
    icon: FaList,
  },
  {
    id: "3",
    href: "/shopping-list",
    pageName: "Shopping List",
    pathName: "/shopping-list",
    icon: FaCartShopping,
  },
  {
    id: "4",
    href: "/profile",
    pageName: "My Profile",
    pathName: "/profile",
    icon: FaUserLarge,
  },
];
