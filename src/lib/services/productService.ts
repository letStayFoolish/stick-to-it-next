import { Product as ProductSchema } from "@/lib/models/Product";
import { CATEGORIES } from "@/lib/types";
import type { Product as ProductType, ProductPlain } from "@/lib/types";

export type QuickAddResult =
  | { ok: true; productId: string }
  | { ok: false; error: string };

function visibilityFilter(userId: string | null) {
  return { owner: { $in: [null, userId] } };
}

export async function getVisibleProducts(
  userId: string | null,
): Promise<ProductPlain[]> {
  return ProductSchema.find(visibilityFilter(userId))
    .select("-owner")
    .lean<ProductPlain[]>();
}

export async function getVisibleProductsByCategory(
  userId: string | null,
  category: string,
): Promise<ProductType[]> {
  return ProductSchema.find({
    category,
    ...visibilityFilter(userId),
  })
    .select("-owner")
    .lean<ProductType[]>();
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

export async function getVisibleProductsByIds(
  userId: string | null,
  ids: string[],
): Promise<ProductPlain[]> {
  return ProductSchema.find({
    _id: { $in: ids },
    ...visibilityFilter(userId),
  })
    .select("-owner")
    .lean<ProductPlain[]>();
}
