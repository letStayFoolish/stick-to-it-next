import { FaHome, FaList } from "react-icons/fa";
import { FaCartShopping, FaUserLarge } from "react-icons/fa6";

export const routes = [
  {
    id: "1",
    href: "/",
    labelKey: "home",
    pathName: "/",
    icon: FaHome,
  },
  {
    id: "2",
    href: "/products",
    labelKey: "products",
    pathName: "/products",
    icon: FaList,
  },
  {
    id: "3",
    href: "/shopping-list",
    labelKey: "shoppingList",
    pathName: "/shopping-list",
    icon: FaCartShopping,
  },
  {
    id: "4",
    href: "/profile",
    labelKey: "profile",
    pathName: "/profile",
    icon: FaUserLarge,
  },
] as const;
