import { Product as ProductSchema } from "@/lib/models/Product";
import type { Product as ProductType, ProductPlain } from "@/lib/types";

function visibilityFilter(userId: string | null) {
  return { owner: { $in: [null, userId] } };
}

export async function getVisibleProducts(
  userId: string | null,
): Promise<ProductPlain[]> {
  return ProductSchema.find(visibilityFilter(userId)).lean<ProductPlain[]>();
}

export async function getVisibleProductsByCategory(
  userId: string | null,
  category: string,
): Promise<ProductType[]> {
  return ProductSchema.find({
    category,
    ...visibilityFilter(userId),
  }).lean<ProductType[]>();
}

export async function getVisibleProductsByIds(
  userId: string | null,
  ids: string[],
): Promise<ProductPlain[]> {
  return ProductSchema.find({
    _id: { $in: ids },
    ...visibilityFilter(userId),
  }).lean<ProductPlain[]>();
}
