import React from "react";
import LogoComponent from "@/components/LogoComponent";
import SidebarWeb from "@/components/SidebarWeb";

const Sidebar: React.FC = () => {
  return (
    <aside className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <LogoComponent />
        </div>
        <div className="flex-1">
          <SidebarWeb />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
