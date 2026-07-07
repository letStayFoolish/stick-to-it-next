import { Product as ProductSchema } from "@/lib/models/Product";
import { User as UserSchema } from "@/lib/models/User";
import { CATEGORIES } from "@/lib/types";
import type { ProductPlain } from "@/lib/types";

export type QuickAddResult =
  | { ok: true; productId: string }
  | { ok: false; error: string };

function visibilityFilter(userId: string | null) {
  return { owner: { $in: [null, userId] } };
}

function withStringId<T extends { _id: unknown }>(docs: T[]): ProductPlain[] {
  return docs.map((doc) => ({
    ...doc,
    _id: String(doc._id),
  })) as unknown as ProductPlain[];
}

export async function getVisibleProducts(
  userId: string | null,
): Promise<ProductPlain[]> {
  const docs = await ProductSchema.find(visibilityFilter(userId))
    .select("-owner")
    .lean();
  return withStringId(docs);
}

export async function getVisibleProductsByCategory(
  userId: string | null,
  category: string,
): Promise<ProductPlain[]> {
  const docs = await ProductSchema.find({
    category,
    ...visibilityFilter(userId),
  })
    .select("-owner")
    .lean();
  return withStringId(docs);
}

export async function quickAddProduct(
  userId: string,
  rawName: string,
  category: string,
): Promise<QuickAddResult> {
  const name = rawName.trim();

  if (!name) {
    return { ok: false, error: "Name is required" };
  }

  if (name.length > 60) {
    return { ok: false, error: "Name must be 60 characters or fewer" };
  }

  if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
    return { ok: false, error: "Unknown category" };
  }

  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const existing = await ProductSchema.findOne({
    category,
    product_name: new RegExp(`^${escapedName}$`, "i"),
    ...visibilityFilter(userId),
  });

  if (existing) {
    return { ok: true, productId: existing._id.toString() };
  }

  const created = await ProductSchema.create({
    category,
    product_name: name,
    owner: userId,
  });

  return { ok: true, productId: created._id.toString() };
}

export async function getOwnedProducts(userId: string): Promise<ProductPlain[]> {
  const docs = await ProductSchema.find({ owner: userId })
    .select("-owner")
    .lean();
  return withStringId(docs);
}

export type MutationResult = { ok: true } | { ok: false; error: string };

export async function updateOwnedProduct(
  userId: string,
  productId: string,
  updates: { name?: string; category?: string },
): Promise<MutationResult> {
  const product = await ProductSchema.findOne({
    _id: productId,
    owner: userId,
  });

  if (!product) {
    return { ok: false, error: "Item not found" };
  }

  if (updates.name !== undefined) {
    const name = updates.name.trim();

    if (!name) {
      return { ok: false, error: "Name is required" };
    }

    if (name.length > 60) {
      return { ok: false, error: "Name must be 60 characters or fewer" };
    }

    product.product_name = name;
  }

  if (updates.category !== undefined) {
    if (!CATEGORIES.includes(updates.category as (typeof CATEGORIES)[number])) {
      return { ok: false, error: "Unknown category" };
    }

    product.category = updates.category;
  }

  await product.save();

  return { ok: true };
}

export async function deleteOwnedProduct(
  userId: string,
  productId: string,
): Promise<MutationResult> {
  const product = await ProductSchema.findOneAndDelete({
    _id: productId,
    owner: userId,
  });

  if (!product) {
    return { ok: false, error: "Item not found" };
  }

  await UserSchema.updateOne(
    { _id: userId },
    { $pull: { listItems: { productId }, likedItems: productId } },
  );

  return { ok: true };
}

export async function getVisibleProductsByIds(
  userId: string | null,
  ids: string[],
): Promise<ProductPlain[]> {
  const docs = await ProductSchema.find({
    _id: { $in: ids },
    ...visibilityFilter(userId),
  })
    .select("-owner")
    .lean();
  return withStringId(docs);
}
