import React, { Suspense } from "react";
import type { Metadata } from "next";
import { getUser } from "@/lib/dal";
import GoToPage from "@/components/GoToPage";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LogOutBtn from "@/components/LogOutBtn";
import { LogOut } from "lucide-react";
import PageHeading from "@/components/PageHeading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FavoritesList } from "@/app/(private)/profile/components/FavoritesList";

export const metadata: Metadata = {
  title: "Profile Page",
};

const SuspenseFallback = () => {
  return (
    <TableRow>
      <TableCell>
        <div className="w-full flex gap-4 items-center py-4 mx-auto">
          Loading Favorites...
          <LoadingSpinner />
        </div>
      </TableCell>
    </TableRow>
  );
};

const Profile: React.FC = async () => {
  const user = await getUser();

  if (!user) return null;

  const profileImage = user?.image;

  const userName = user.name.split(" ");

  return (
    <main className="flex justify-center flex-1 bg-background">
      <div className="container py-24 px-4">
        {/* Profile Section */}
        <header className="flex flex-col items-center text-center mb-12">
          <Avatar className="h-32 w-32 md:h-48 md:w-48 mb-8">
            <AvatarImage src={profileImage} alt="Profile Image" />
            <AvatarFallback className="text-7xl h-full w-full">
              {userName.length > 1
                ? userName[0][0].toUpperCase() + userName[1][0].toUpperCase()
                : userName[0][0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <PageHeading>{user.name}</PageHeading>
          <h2 className="text-lg text-neutral-500 mb-4">{user.email}</h2>
          <div className="w-full flex justify-between mx-auto mt-8">
            <GoToPage
              href="/shopping-list"
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:opacity-75 transition-all"
            >
              Shopping List
            </GoToPage>
            <LogOutBtn btnVariant="default">
              <LogOut /> Leave
            </LogOutBtn>
          </div>
        </header>
        {/* Favorite Products Table */}
        <section className="flex flex-col items-center">
          <div className="mb-6 px-3 py-4">
            <h3 className="text-lg font-semibold">Favorite Products</h3>
          </div>
          <section className="mt-4 mb-4 w-full">
            <Table className="w-full caption-bottom">
              <TableCaption>Shows the list of your liked products</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden md:block">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <Suspense fallback={<SuspenseFallback />}>
                  <FavoritesList />
                </Suspense>
              </TableBody>
            </Table>
          </section>
        </section>
      </div>
    </main>
  );
};

export default Profile;
