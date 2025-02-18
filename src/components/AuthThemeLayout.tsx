import React, { PropsWithChildren } from "react";
import Header from "@/components/Header";

type Props = PropsWithChildren;

const AuthThemeLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex flex-1">{children}</main>
    </div>
  );
};

export default AuthThemeLayout;
