import type { Metadata } from "next";
import "@/app/globals.css";
import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          "flex flex-col h-full min-h-screen font-sans antialiased",
          poppins.className,
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
