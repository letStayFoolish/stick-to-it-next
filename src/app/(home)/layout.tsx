import React, { PropsWithChildren } from "react";
import MainThemeLayout from "@/components/MainThemeLayout";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return <MainThemeLayout>{children}</MainThemeLayout>;
};

export default Layout;
