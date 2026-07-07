import { Product as ProductSchema } from "@/lib/models/Product";
import { User as UserSchema } from "@/lib/models/User";
import { CATEGORIES } from "@/lib/types";
import type { ProductPlain } from "@/lib/types";
import { SUPPORTED_LOCALES, type Locale } from "@/lib/locale";

export type LocalizedName = Partial<Record<Locale, string>>;

/**
 * Seeded products store either a plain string (not-yet-migrated) or a
 * locale-keyed object (migrated). User-created items are always a plain
 * string and display exactly as typed in every locale. This is the single
 * place that turns either shape into one display string.
 */
export function resolveProductName(
  rawName: string | LocalizedName,
  locale: Locale,
): string {
  if (typeof rawName === "string") {
    return rawName;
  }

  return (
    rawName[locale] ?? rawName.en ?? Object.values(rawName)[0] ?? ""
  );
}

export type ProductErrorCode =
  | "NAME_REQUIRED"
  | "NAME_TOO_LONG"
  | "UNKNOWN_CATEGORY"
  | "ITEM_NOT_FOUND";

/** Maps a stable error code to its key in the `Errors` message namespace. */
export const PRODUCT_ERROR_MESSAGE_KEYS: Record<ProductErrorCode, string> = {
  NAME_REQUIRED: "nameRequired",
  NAME_TOO_LONG: "nameTooLong",
  UNKNOWN_CATEGORY: "unknownCategory",
  ITEM_NOT_FOUND: "itemNotFound",
};

export type QuickAddResult =
  | { ok: true; productId: string }
  | { ok: false; error: ProductErrorCode };

function visibilityFilter(userId: string | null) {
  return { owner: { $in: [null, userId] } };
}

function toDto(docs: Record<string, unknown>[], locale: Locale): ProductPlain[] {
  return docs.map((doc) => ({
    ...doc,
    _id: String(doc._id),
    product_name: resolveProductName(
      doc.product_name as string | LocalizedName,
      locale,
    ),
  })) as unknown as ProductPlain[];
}

export async function getVisibleProducts(
  userId: string | null,
  locale: Locale,
): Promise<ProductPlain[]> {
  const docs = await ProductSchema.find(visibilityFilter(userId))
    .select("-owner")
    .lean();
  return toDto(docs, locale);
}

export async function getVisibleProductsByCategory(
  userId: string | null,
  category: string,
  locale: Locale,
): Promise<ProductPlain[]> {
  const docs = await ProductSchema.find({
    category,
    ...visibilityFilter(userId),
  })
    .select("-owner")
    .lean();
  return toDto(docs, locale);
}

export async function quickAddProduct(
  userId: string,
  rawName: string,
  category: string,
): Promise<QuickAddResult> {
  const name = rawName.trim();

  if (!name) {
    return { ok: false, error: "NAME_REQUIRED" };
  }

  if (name.length > 60) {
    return { ok: false, error: "NAME_TOO_LONG" };
  }

  if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
    return { ok: false, error: "UNKNOWN_CATEGORY" };
  }

  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const nameRegex = new RegExp(`^${escapedName}$`, "i");

  // A migrated seeded product stores its name as a locale-keyed object, not
  // a plain string, so a case-insensitive match must check the plain-string
  // shape (own items, not-yet-migrated seeded items) OR any locale sub-field.
  const existing = await ProductSchema.findOne({
    category,
    ...visibilityFilter(userId),
    $or: [
      { product_name: nameRegex },
      ...SUPPORTED_LOCALES.map((loc) => ({
        [`product_name.${loc}`]: nameRegex,
      })),
    ],
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

export async function getOwnedProducts(
  userId: string,
  locale: Locale,
): Promise<ProductPlain[]> {
  const docs = await ProductSchema.find({ owner: userId })
    .select("-owner")
    .lean();
  return toDto(docs, locale);
}

export type MutationResult =
  | { ok: true }
  | { ok: false; error: ProductErrorCode };

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
    return { ok: false, error: "ITEM_NOT_FOUND" };
  }

  if (updates.name !== undefined) {
    const name = updates.name.trim();

    if (!name) {
      return { ok: false, error: "NAME_REQUIRED" };
    }

    if (name.length > 60) {
      return { ok: false, error: "NAME_TOO_LONG" };
    }

    product.product_name = name;
  }

  if (updates.category !== undefined) {
    if (!CATEGORIES.includes(updates.category as (typeof CATEGORIES)[number])) {
      return { ok: false, error: "UNKNOWN_CATEGORY" };
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
    return { ok: false, error: "ITEM_NOT_FOUND" };
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
  locale: Locale,
): Promise<ProductPlain[]> {
  const docs = await ProductSchema.find({
    _id: { $in: ids },
    ...visibilityFilter(userId),
  })
    .select("-owner")
    .lean();
  return toDto(docs, locale);
}
