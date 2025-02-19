import React from "react";
import type { Metadata } from "next";
import { getUser } from "@/lib/dal";
import Image from "next/image";
import GoToPage from "@/components/GoToPage";
import NoData from "@/components/ui/NoData";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchFavoritesProducts } from "@/lib/actions";
import { FaUserCircle } from "react-icons/fa";
import LogOutBtn from "@/components/LogOutBtn";
import { LogOut } from "lucide-react";
import PageHeading from "@/components/PageHeading";
import { ShoppingListTableRow } from "./components/TableRow";

export const metadata: Metadata = {
  title: "Profile Page",
};

const Profile: React.FC = async () => {
  const user = await getUser();

  if (!user) return null;

  const profileImage = user?.image;

  const likedProducts = await fetchFavoritesProducts();

  return (
    <main className="flex justify-center flex-1 bg-slate-50 dark:bg-background">
      <div className="container py-24">
        {/* Profile Section */}
        <header className="flex flex-col items-center text-center mb-12">
          {profileImage ? (
            <Image
              className="h-32 w-32 md:h-48 md:w-48 rounded-full object-cover mb-4"
              src={profileImage}
              width={200}
              height={200}
              alt="User Avatar"
            />
          ) : (
            <FaUserCircle className="bg-primary-foreground text-opacity-90 h-32 w-32 md:h-48 md:w-48 border-0 outline-0 rounded-full object-fill mb-4" />
          )}
          <PageHeading>{user.name}</PageHeading>
          {/*<h1 className="text-3xl font-bold mb-2"></h1>*/}
          <h2 className="text-lg text-neutral-500 mb-4">{user.email}</h2>
          <div className="flex flex-row gap-2">
            <GoToPage
              href="/"
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:opacity-75 transition-all"
            >
              Go to Home
            </GoToPage>
            <LogOutBtn btnVariant="outline">
              <LogOut /> Leave
            </LogOutBtn>
          </div>
        </header>
        {/* Favorite Products Table */}
        <section className="flex flex-col items-center">
          <div className="mb-6 px-3 py-4">
            <h3 className="text-lg font-semibold">Favorite Products</h3>
          </div>
          {likedProducts && likedProducts.length === 0 ? (
            <NoData text={`Add some products to your\n favorites.`} />
          ) : (
            <section className="mt-4 mb-4 w-full">
              <Table className="w-full caption-bottom">
                <TableCaption>
                  Shows the list of your liked products
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden md:block">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {likedProducts &&
                    likedProducts.map((product) => (
                      <ShoppingListTableRow
                        key={product._id}
                        product={product}
                      />
                    ))}
                </TableBody>
              </Table>
            </section>
          )}
        </section>
      </div>
    </main>
  );
};

export default Profile;
