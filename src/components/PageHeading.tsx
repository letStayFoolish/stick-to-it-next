import React from "react";
import { getUser } from "@/lib/dal";
import Link from "next/link";

const PageHeading: React.FC = async () => {
  const user = await getUser();

  return (
    <div className="mb-6 text-center">
      <>
        {user ? (
          <h1 className="font-bold text-3xl md:text-4xl mb-2 drop-shadow-md">
            Hello,{" "}
            <span className="text-primary">{user.name?.split(" ")[0]}</span>!
          </h1>
        ) : (
          <h1 className="font-bold text-3xl md:text-4xl mb-2">Welcome!</h1>
        )}

        <p className="mx-auto text-xl text-gray-600 w-2/3">
          {user ? (
            `Ready to get started with your next grocery trip? Add products to your cart, organize your list, and make shopping easier than ever!`
          ) : (
            <>
              <span className="text-primary font-medium underline hover:opacity-75 transition-all">
                <Link href={"/register"}>Create an account</Link>
              </span>
              , or{" "}
              <span className="text-primary font-medium underline hover:opacity-75 transition-all">
                <Link href={"/login"}>use one</Link>
              </span>{" "}
              you already made instead and start building your grocery list now!
              Browse through categories, add products, and simplify your
              shopping experience.
            </>
          )}
        </p>
      </>
    </div>
  );
};

export default PageHeading;
