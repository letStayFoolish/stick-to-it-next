import React, { PropsWithChildren } from "react";
import AuthThemeLayout from "@/components/AuthThemeLayout";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return <AuthThemeLayout>{children}</AuthThemeLayout>;
};

export default Layout;
