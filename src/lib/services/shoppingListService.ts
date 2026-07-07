import { User } from "@/lib/models/User";

export type ShoppingListItemDto = {
  productId: string;
  quantity: number;
  checked: boolean;
};

async function loadUser(userId: string) {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error(`User '${userId}' not found`);
  }

  return user;
}

function toDto(item: any): ShoppingListItemDto {
  return {
    productId: item.productId.toString(),
    quantity: item.quantity,
    checked: Boolean(item.checked),
  };
}

export async function addItem(
  userId: string,
  productId: string,
): Promise<ShoppingListItemDto[]> {
  const user = await loadUser(userId);

  const alreadyOnList = user.listItems.some(
    (item: any) => item.productId?.toString() === productId,
  );

  if (!alreadyOnList) {
    user.listItems.push({ productId, quantity: 1, checked: false });
    await user.save();
  }

  return user.listItems.map(toDto);
}

export async function setQuantity(
  userId: string,
  productId: string,
  quantity: number,
): Promise<ShoppingListItemDto[]> {
  const user = await loadUser(userId);

  const itemIndex = user.listItems.findIndex(
    (item: any) => item.productId?.toString() === productId,
  );

  if (itemIndex === -1) {
    throw new Error(`Product '${productId}' is not on user '${userId}''s list`);
  }

  const clamped = Math.max(0, Math.min(100, quantity));

  if (clamped === 0) {
    user.listItems.splice(itemIndex, 1);
  } else {
    user.listItems[itemIndex].quantity = clamped;
  }

  await user.save();

  return user.listItems.map(toDto);
}

export async function setNotes(
  userId: string,
  notes: string,
): Promise<{ notes: string }> {
  const user = await loadUser(userId);

  user.notes = notes;

  await user.save();

  return { notes: user.notes };
}

export async function clearList(
  userId: string,
): Promise<{ listItems: ShoppingListItemDto[]; notes: string }> {
  const user = await loadUser(userId);

  user.listItems = [];
  user.notes = "";

  await user.save();

  return { listItems: [], notes: "" };
}

export async function setChecked(
  userId: string,
  productId: string,
  checked: boolean,
): Promise<ShoppingListItemDto[]> {
  const user = await loadUser(userId);

  const item = user.listItems.find(
    (item: any) => item.productId?.toString() === productId,
  );

  if (!item) {
    throw new Error(`Product '${productId}' is not on user '${userId}''s list`);
  }

  item.checked = checked;

  await user.save();

  return user.listItems.map(toDto);
}

export async function toggleLiked(
  userId: string,
  productId: string,
): Promise<string[]> {
  const user = await loadUser(userId);

  const isLiked = user.likedItems.some(
    (id: any) => id?.toString() === productId,
  );

  if (isLiked) {
    user.likedItems = user.likedItems.filter(
      (id: any) => id?.toString() !== productId,
    );
  } else {
    user.likedItems.push(productId);
  }

  await user.save();

  return user.likedItems.map((id: any) => id.toString());
}
