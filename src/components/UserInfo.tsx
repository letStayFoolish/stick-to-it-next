"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

const UserInfo: React.FC = () => {
  const { data: session } = useSession();

  return (
    <div className="p-4 bg-gray-100 rounded-lg max-w-sm mx-auto shadow">
      <div className="space-y-4">
        <div className="text-lg font-medium text-gray-700">
          Name: <span className="text-black">{session?.user?.name}</span>
        </div>
        <div className="text-lg font-medium text-gray-700">
          Email: <span>{session?.user?.email}</span>
        </div>

        <Button onClick={() => signOut()}>Logout</Button>
      </div>
    </div>
  );
};

export default UserInfo;
