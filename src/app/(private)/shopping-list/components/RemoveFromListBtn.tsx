"use client";

import React, { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Trash2 } from "lucide-react";
import { updateQuantity as updateQuantityAction } from "@/lib/actions/updateQuantity";
import type { ProductPlain } from "@/lib/types";

type Props = {
  product: ProductPlain;
};

const RemoveFromListBtn: React.FC<Props> = ({ product }) => {
  const [state, formAction, isPending] = useActionState(updateQuantityAction, {
    message: "",
    success: false,
  });

  return (
    <form action={formAction}>
      <input type="hidden" name="product_id" value={product._id} />
      <input type="hidden" name="action" value="remove-from-list" />
      <Button
        variant="destructive"
        className="bg-transparent m-0 p-0 text-red-500 hover:text-red-700 hover:bg-transparent"
        disabled={isPending}
      >
        {isPending ? <LoadingSpinner /> : <Trash2 size={18} />}
      </Button>

      <p className="sr-only" aria-live="polite" role="status">
        {state?.message}
      </p>
    </form>
  );
};

export default RemoveFromListBtn;
