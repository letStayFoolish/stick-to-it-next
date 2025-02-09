import { FaHome, FaList, FaRegHeart } from "react-icons/fa";
import { FaCartShopping, FaUserLarge } from "react-icons/fa6";

export const routes = [
  {
    id: "1",
    href: "/",
    pageName: "HomePage",
    pathName: "/",
    icon: FaHome,
  },
  {
    id: "2",
    href: "/products",
    pageName: "ProductsPage",
    pathName: "/products",
    icon: FaList,
  },
  {
    id: "3",
    href: "/shopping-list",
    pageName: "ShoppingList",
    pathName: "/shopping-list",
    icon: FaCartShopping,
  },
  {
    id: "4",
    href: "/favorites",
    pageName: "MyFavoritesPage",
    pathName: "/favorites",
    icon: FaRegHeart,
  },
  {
    id: "5",
    href: "/profile",
    pageName: "MyProfilePage",
    pathName: "/profile",
    icon: FaUserLarge,
  },
];
