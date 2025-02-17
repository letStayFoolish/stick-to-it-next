"use client";

import React from "react";
import { useSession } from "next-auth/react";

const PageHeading: React.FC = () => {
  const { data: session } = useSession();

  return (
    <div className="mb-6 text-center">
      <>
        {session ? (
          <h1 className="font-bold text-3xl md:text-4xl mb-2 drop-shadow-md">
            Hello,{" "}
            <span className="text-primary">
              {session.user?.name?.split(" "[0])}
            </span>
            !
          </h1>
        ) : (
          <h1 className="font-bold text-3xl md:text-4xl mb-2">Welcome!</h1>
        )}

        <p className="mx-auto text-xl text-gray-600 w-2/3">Nice message</p>
      </>
    </div>
  );
};

export default PageHeading;
