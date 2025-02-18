"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions";
import { LogOut } from "lucide-react";

const LogOutBtn: React.FC = () => {
  return (
    <Button
      className="text-sm flex justify-start items-center gap-4 px-3 py-2"
      onClick={() => logout()}
    >
      <LogOut /> Sign Out
    </Button>
  );
};

export default LogOutBtn;
