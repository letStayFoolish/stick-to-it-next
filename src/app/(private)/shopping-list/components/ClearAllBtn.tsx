"use client";

import { Button } from "@/components/ui/button";
import React, { ButtonHTMLAttributes, useState } from "react";
import { clearProductsAction } from "@/lib/actions";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

const ClearAll: React.FC<Props> = ({ className, ...props }) => {
  const classes = cn(
    "hover:opacity-80 hover:text-opacity-80 transition-all",
    className,
  );

  const [isPending, setIsPending] = useState(false);

  const handleClick = async () => {
    try {
      setIsPending(true);

      await clearProductsAction();
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      disabled={isPending}
      onClick={handleClick}
      variant={"destructive"}
      className={classes}
      {...props}
    >
      {isPending ? `Clearing...` : `Clear List`}
    </Button>
  );
};

export default ClearAll;
