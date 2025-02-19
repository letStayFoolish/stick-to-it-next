import type { Metadata } from "next";
import "@/app/globals.css";
import React from "react";
import { poppins } from "@/ui/fonts";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    template: "%s | Stick To It",
    default: "Stick To It",
  },
  description:
    "Stick To It Web Application To search and add groceries to your shopping (todo) shopping-list.",
  keywords: ["groceries", "shopping list", "todo", "list"],
  applicationName: "Stick To It",
  authors: { name: "Nemanja Karaklajic" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "flex flex-col h-full min-h-screen font-sans antialiased",
          poppins.className,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
