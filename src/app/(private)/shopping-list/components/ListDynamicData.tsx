import React from "react";
import { ShoppingList as List } from "@/app/(private)/shopping-list/components/ShoppingList";
import Notes from "@/app/(private)/shopping-list/components/Notes";
import { fetchShoppingListItems as fetchShoppingListItemsAction } from "@/lib/actions/fetchShoppingListItems";
import { getUser } from "@/lib/dal";
import EmptyShoppingList from "@/app/(private)/shopping-list/components/EmptyShoppingList";

const ListDynamicData: React.FC = async () => {
  const fetchedProducts = await fetchShoppingListItemsAction();
  const user = await getUser();

  if (fetchedProducts?.length === 0) return <EmptyShoppingList />;

  return (
    <>
      <List products={fetchedProducts ?? []} />
      <Notes initialNotes={user?.notes ?? ""} />
    </>
  );
};

export default ListDynamicData;
