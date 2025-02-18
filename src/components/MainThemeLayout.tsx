import React, { PropsWithChildren } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

type Props = PropsWithChildren;

const MainThemeLayout: React.FC<Props> = async ({ children }) => {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <Header />
        <main className="flex flex-col flex-1 md:container max-w-7xl md:mx-auto">
          {children}
        </main>
        <Footer />
        {/*<Toaster />*/}
      </div>
    </div>
  );
};

export default MainThemeLayout;
