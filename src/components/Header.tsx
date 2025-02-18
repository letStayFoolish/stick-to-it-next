import React from "react";
import SidebarMobile from "@/components/Sidebar/SidebarMobile";
import ModeToggle from "@/components/ModeToggle";

const Header: React.FC = async () => {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <SidebarMobile />
      <div className="w-full flex-1">{/*  PLACEHOLDER SEARCH INPUT*/}</div>
      <ModeToggle />
    </header>
  );
};

export default Header;
