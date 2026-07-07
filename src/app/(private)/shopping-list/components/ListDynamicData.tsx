import React from "react";
import { ShoppingList as List } from "@/app/(private)/shopping-list/components/ShoppingList";
import TripMemo from "@/app/(private)/shopping-list/components/TripMemo";
import QuickAddItem from "@/app/(private)/shopping-list/components/QuickAddItem";
import ClearAllBtn from "@/app/(private)/shopping-list/components/ClearAllBtn";
import { fetchShoppingListItems as fetchShoppingListItemsAction } from "@/lib/actions/fetchShoppingListItems";
import { getUser } from "@/lib/dal";
import EmptyShoppingList from "@/app/(private)/shopping-list/components/EmptyShoppingList";

const ListDynamicData: React.FC = async () => {
  const fetchedProducts = await fetchShoppingListItemsAction();
  const user = await getUser();

  if (fetchedProducts?.length === 0) {
    return (
      <>
        <EmptyShoppingList />
        <QuickAddItem />
        <TripMemo initialNotes={user?.notes ?? ""} />
      </>
    );
  }

  return (
    <>
      <List products={fetchedProducts ?? []} />
      <QuickAddItem />
      <TripMemo initialNotes={user?.notes ?? ""} />
      <ClearAllBtn className="mt-6 w-full" />
    </>
  );
};

export default ListDynamicData;
