import React from "react";
import { getUser } from "@/lib/dal";

const PageHeading: React.FC = async () => {
  const user = await getUser();

  return (
    <div className="mb-6 text-center">
      <>
        {user ? (
          <h1 className="font-bold text-3xl md:text-4xl mb-2 drop-shadow-md">
            Hello,{" "}
            <span className="text-primary">{user.name?.split(" "[0])}</span>!
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
