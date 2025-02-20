"use client";

import React, { useState } from "react";
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

      const response = await fetch(`/api/user/shopping-list-remove-item`, {
        method: "DELETE",
        body: JSON.stringify({
          productId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to remove item");
      }

      // Optionally handle the updated cart data returned by the API (if needed)
      const data = await response.json();
      console.log("Updated shopping list:", data.updatedList);
    } catch (error: any) {
      console.error("Error removing item:", error);
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
