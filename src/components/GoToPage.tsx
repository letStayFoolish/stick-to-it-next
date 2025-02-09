import React, { PropsWithChildren } from "react";
import Link, { LinkProps } from "next/link";
import { cn } from "@/lib/utils";

type Props = LinkProps &
  PropsWithChildren & {
    className?: string;
  };

const GoToPage: React.FC<Props> = ({ children, className, ...props }) => {
  return (
    <Link className={cn("", className)} {...props}>
      {children}
    </Link>
  );
};

export default GoToPage;
