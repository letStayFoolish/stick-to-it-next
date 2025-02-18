"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions";
import { LogOut } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useRouter } from "next/navigation";

const LogOutBtn: React.FC = () => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter(); // Initialize useRouter

  return (
    <Button
      className="text-sm flex justify-start items-center gap-4 px-3 py-2"
      onClick={async () => {
        try {
          setIsPending(true);

          await logout();

          router.push("/login");
        } catch (error) {
          console.log(error);
        } finally {
          setIsPending(false);
        }
      }}
    >
      {isPending ? (
        <LoadingSpinner />
      ) : (
        <>
          <LogOut /> Sign Out
        </>
      )}
    </Button>
  );
};

export default LogOutBtn;
