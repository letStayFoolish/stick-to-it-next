"use client";

import React, { useState } from "react";
import { handleRemoveFromShoppingList } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Trash2 } from "lucide-react";

type Props = {
  productId: string;
};

const RemoveFromListBtn: React.FC<Props> = ({ productId }) => {
  const [isPending, setIsPending] = useState(false);

  const handleRemove = async () => {
    try {
      setIsPending(true);

      await handleRemoveFromShoppingList(productId);
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsPending(false);
    }
  };
  return (
    <Button
      onClick={handleRemove}
      variant="destructive"
      className="bg-transparent m-0 p-0 text-red-500 hover:text-red-700 hover:bg-transparent"
      disabled={isPending}
    >
      {isPending ? <LoadingSpinner /> : <Trash2 size={18} />}
    </Button>
  );
};

export default RemoveFromListBtn;
