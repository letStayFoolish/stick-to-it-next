"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = {
  btnVariant:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  children?: React.ReactNode;
  className?: string;
};

const LogOutBtn: React.FC<Props> = ({
  btnVariant = "default",
  children,
  className,
}) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter(); // Initialize useRouter

  const classes = cn(
    "text-sm flex justify-start items-center gap-4 px-3 py-2",
    className,
  );

  return (
    <Button
      variant={btnVariant}
      className={classes}
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
      {isPending ? <LoadingSpinner /> : children}
    </Button>
  );
};

export default LogOutBtn;
