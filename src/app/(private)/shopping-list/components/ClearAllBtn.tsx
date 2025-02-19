"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { clearProductsAction } from "@/lib/actions";

const ClearAll: React.FC = () => {
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
      variant={"secondary"}
      className="w-full mx-auto mt-6 mb-8 hover:opacity-80 hover:text-destructive transition-all"
    >
      {isPending ? `Clearing...` : `Clear All`}
    </Button>
  );
};

export default ClearAll;
