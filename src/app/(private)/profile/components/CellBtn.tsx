"use client";

import React, { useActionState } from "react";
import type { ProductPlain } from "@/lib/types";
import { updateQuantity as updateQuantityAction } from "@/lib/actions/updateQuantity";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  product: ProductPlain;
  quantityFromServer: number | undefined;
};
const CellBtn: React.FC<Props> = ({ quantityFromServer = 0, product }) => {
  const [state, formAction, isPending] = useActionState(updateQuantityAction, {
    message: "",
    success: quantityFromServer > 0,
  });

  return (
    <form action={formAction}>
      <input type="hidden" name="product_id" value={product._id} />
      <input type="hidden" name="action" value="add-to-list" />

      <Button
        variant="outline"
        className="text-accent-foreground hover:opacity-80"
        type="submit"
        disabled={isPending || quantityFromServer !== 0}
      >
        {isPending ? <LoadingSpinner /> : <ShoppingCart />}
      </Button>

      <p className="sr-only" aria-live="polite" role="status">
        {state?.message}
      </p>
    </form>
  );
};

export default CellBtn;
