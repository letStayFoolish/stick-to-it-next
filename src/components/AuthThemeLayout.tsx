import React, { PropsWithChildren } from "react";
import Header from "@/components/Header";

type Props = PropsWithChildren;

const AuthThemeLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen w-full">
      <div className="flex flex-col">
        <Header />
        <main className="flex flex-col flex-1 md:container max-w-7xl md:mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AuthThemeLayout;
