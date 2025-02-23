"use client";

import React, { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { FaHeart } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { ProductPlain } from "@/lib/types";
import { toggleLike as toggleLikeAction } from "@/lib/actions/toggleLike";
// import { useToast } from "@/hooks/use-toast";
// import { ToastAction } from "@/components/ui/toast";
// import Link from "next/link";

type Props = {
  product: ProductPlain;
};

const LikeButtonsSet: React.FC<Props> = ({ product }) => {
  // const { toast } = useToast();

  const [state, formAction, isPending] = useActionState(toggleLikeAction, {
    message: "",
    success: product.isLiked,
  });

  // useEffect(() => {
  //   if (!isPending) return;
  //
  //   if (state.success) {
  //     toast({
  //       title: "Favorite added!",
  //       description: `Added ${product.product_name} to your favorites list.`,
  //       action: (
  //         <ToastAction altText="Go To Shopping List">
  //           <Link href={"/profile"}>Go to profile page</Link>
  //         </ToastAction>
  //       ),
  //     });
  //   } else {
  //     toast({
  //       title: "Favorite removed!",
  //       description: `${product.product_name} removed from your favorites list.`,
  //       action: (
  //         <ToastAction altText="Go To Shopping List">
  //           <Link href={"/profile"}>Go to profile page</Link>
  //         </ToastAction>
  //       ),
  //     });
  //   }
  // }, [state.success, isPending, toast, product]);

  return (
    <form action={formAction}>
      <input type="hidden" name="product_id" value={product._id} />
      <Button
        variant="ghost"
        className="text-primary p-0 m-0 hover:bg-transparent"
        disabled={isPending}
      >
        {product.isLiked ? (
          <FaHeart className="cursor-pointer hover:opacity-80 hover:scale-125 transition text-lg w-[30px] h-[30px] sm:w-[35px] sm:h-[35px] md:w-[40px] md:h-[40px]" />
        ) : (
          <FaRegHeart className="cursor-pointer hover:opacity-80 hover:scale-125 transition text-lg w-[30px] h-[30px] sm:w-[35px] sm:h-[35px] md:w-[40px] md:h-[40px]" />
        )}
      </Button>
      <p className="sr-only" aria-live="polite" role="status">
        {state?.message}
      </p>
    </form>
  );
};

export default LikeButtonsSet;
