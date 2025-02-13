"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function SignIn() {
  return (
    <Button
      className="text-sm flex justify-start items-center gap-4 px-3 py-2"
      onClick={() => signIn("google")}
    >
      Sign In
    </Button>
  );
}
