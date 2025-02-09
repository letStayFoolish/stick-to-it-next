import React from "react";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

const LogoComponent: React.FC = () => {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold">
      <ShoppingCart className="h-6 w-6" /> Stick To It
      <span className="sr-only">Stick To It</span>
    </Link>
  );
};

export default LogoComponent;
