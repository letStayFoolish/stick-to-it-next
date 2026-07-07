import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Product } from "@/lib/models/Product";
import { User } from "@/lib/models/User";
import * as productService from "@/lib/services/productService";

function createSeededProduct(overrides: Record<string, unknown> = {}) {
  return Product.create({
    category: "fruits",
    product_name: "seeded apple",
    ...overrides,
  });
}

function createUser(overrides: Record<string, unknown> = {}) {
  return User.create({
    name: "Test User",
    email: `${Math.random()}@example.com`,
    password: "hashed-password",
    ...overrides,
  });
}

describe("resolveProductName", () => {
  it("returns a plain string name as-is regardless of locale", () => {
    expect(productService.resolveProductName("Batteries", "de")).toBe(
      "Batteries",
    );
  });

  it("resolves a locale-keyed name to the requested locale", () => {
    const name = { en: "Milk", de: "Milch", ru: "Молоко" };
    expect(productService.resolveProductName(name, "de")).toBe("Milch");
  });

  it("falls back to en when the requested locale is missing", () => {
    const name = { en: "Milk", de: "Milch" };
    expect(productService.resolveProductName(name, "es")).toBe("Milk");
  });

  it("falls back to any available value when en is also missing", () => {
    const name = { de: "Milch" };
    expect(productService.resolveProductName(name, "es")).toBe("Milch");
  });
});

describe("productService", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterEach(async () => {
    await Product.deleteMany({});
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe("getVisibleProducts", () => {
    it("includes seeded products for any user", async () => {
      await createSeededProduct();
      const userId = new mongoose.Types.ObjectId().toString();

      const visible = await productService.getVisibleProducts(userId, "en");

      expect(visible).toHaveLength(1);
      expect(visible[0].product_name).toBe("seeded apple");
    });

    it("includes a user's own product but excludes another user's product", async () => {
      const userA = new mongoose.Types.ObjectId().toString();
      const userB = new mongoose.Types.ObjectId().toString();

      await createSeededProduct({ product_name: "user a's item", owner: userA });
      await createSeededProduct({ product_name: "user b's item", owner: userB });

      const visibleToA = await productService.getVisibleProducts(userA, "en");
      const visibleToB = await productService.getVisibleProducts(userB, "en");

      expect(visibleToA.map((p) => p.product_name)).toEqual(["user a's item"]);
      expect(visibleToB.map((p) => p.product_name)).toEqual(["user b's item"]);
    });

    it("excludes owned products from an anonymous (no user) request", async () => {
      const userA = new mongoose.Types.ObjectId().toString();
      await createSeededProduct({ product_name: "user a's item", owner: userA });
      await createSeededProduct({ product_name: "seeded item" });

      const visible = await productService.getVisibleProducts(null, "en");

      expect(visible.map((p) => p.product_name)).toEqual(["seeded item"]);
    });

    it("does not expose the raw owner reference on an owned product", async () => {
      const userA = new mongoose.Types.ObjectId().toString();
      await createSeededProduct({ product_name: "user a's item", owner: userA });

      const visible = await productService.getVisibleProducts(userA, "en");

      expect(visible[0].owner).toBeUndefined();
    });
  });

  describe("getVisibleProductsByCategory", () => {
    it("scopes by category and excludes another user's product in the same category", async () => {
      const userA = new mongoose.Types.ObjectId().toString();
      const userB = new mongoose.Types.ObjectId().toString();

      await createSeededProduct({
        category: "fruits",
        product_name: "user a's apple",
        owner: userA,
      });
      await createSeededProduct({
        category: "fruits",
        product_name: "user b's apple",
        owner: userB,
      });
      await createSeededProduct({
        category: "vegetables",
        product_name: "seeded carrot",
      });

      const visible = await productService.getVisibleProductsByCategory(
        userA,
        "fruits",
        "en",
      );

      expect(visible.map((p) => p.product_name)).toEqual(["user a's apple"]);
    });
  });

  describe("quickAddProduct", () => {
    it("creates a new owned product with the trimmed name and given category", async () => {
      const userId = new mongoose.Types.ObjectId().toString();

      const result = await productService.quickAddProduct(
        userId,
        "  Batteries  ",
        "house-kitchen",
      );

      expect(result.ok).toBe(true);
      if (!result.ok) throw new Error("expected ok result");

      const created = await Product.findById(result.productId);
      expect(created?.product_name).toBe("Batteries");
      expect(created?.category).toBe("house-kitchen");
      expect(created?.owner?.toString()).toBe(userId);
    });

    it("rejects an empty or whitespace-only name without creating a product", async () => {
      const userId = new mongoose.Types.ObjectId().toString();

      const result = await productService.quickAddProduct(
        userId,
        "   ",
        "house-kitchen",
      );

      expect(result.ok).toBe(false);
      expect(await Product.countDocuments()).toBe(0);
    });

    it("rejects a name longer than 60 characters without creating a product", async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const tooLong = "a".repeat(61);

      const result = await productService.quickAddProduct(
        userId,
        tooLong,
        "house-kitchen",
      );

      expect(result.ok).toBe(false);
      expect(await Product.countDocuments()).toBe(0);
    });

    it("rejects a category outside the closed category set without creating a product", async () => {
      const userId = new mongoose.Types.ObjectId().toString();

      const result = await productService.quickAddProduct(
        userId,
        "Batteries",
        "not-a-real-category",
      );

      expect(result.ok).toBe(false);
      expect(await Product.countDocuments()).toBe(0);
    });

    it("reuses an existing seeded product on a case-insensitive name+category match", async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const seeded = await createSeededProduct({
        category: "milk-eggs-cheese",
        product_name: "Milk",
      });

      const result = await productService.quickAddProduct(
        userId,
        "milk",
        "milk-eggs-cheese",
      );

      expect(result.ok).toBe(true);
      if (!result.ok) throw new Error("expected ok result");
      expect(result.productId).toBe(seeded._id.toString());
      expect(await Product.countDocuments()).toBe(1);
    });

    it("reuses an existing migrated (locale-keyed) seeded product on a case-insensitive match against any locale", async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const seeded = await createSeededProduct({
        category: "milk-eggs-cheese",
        product_name: { en: "Milk", de: "Milch", ru: "Молоко" },
      });

      const result = await productService.quickAddProduct(
        userId,
        "milch",
        "milk-eggs-cheese",
      );

      expect(result.ok).toBe(true);
      if (!result.ok) throw new Error("expected ok result");
      expect(result.productId).toBe(seeded._id.toString());
      expect(await Product.countDocuments()).toBe(1);
    });

    it("reuses the user's own existing product on a case-insensitive match instead of duplicating it", async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const first = await productService.quickAddProduct(
        userId,
        "Chips",
        "chips-snacks",
      );
      if (!first.ok) throw new Error("expected ok result");

      const second = await productService.quickAddProduct(
        userId,
        "CHIPS",
        "chips-snacks",
      );

      expect(second.ok).toBe(true);
      if (!second.ok) throw new Error("expected ok result");
      expect(second.productId).toBe(first.productId);
      expect(await Product.countDocuments()).toBe(1);
    });

    it("does not reuse another user's owned product with the same name and category", async () => {
      const userA = new mongoose.Types.ObjectId().toString();
      const userB = new mongoose.Types.ObjectId().toString();
      const ownedByB = await productService.quickAddProduct(
        userB,
        "Soap",
        "cleaning",
      );
      if (!ownedByB.ok) throw new Error("expected ok result");

      const result = await productService.quickAddProduct(
        userA,
        "Soap",
        "cleaning",
      );

      expect(result.ok).toBe(true);
      if (!result.ok) throw new Error("expected ok result");
      expect(result.productId).not.toBe(ownedByB.productId);
      expect(await Product.countDocuments()).toBe(2);
    });
  });

  describe("getVisibleProducts locale resolution", () => {
    it("resolves a migrated seeded product's name to the requested locale", async () => {
      await createSeededProduct({
        product_name: { en: "Milk", de: "Milch", ru: "Молоко" },
      });
      const userId = new mongoose.Types.ObjectId().toString();

      const visible = await productService.getVisibleProducts(userId, "de");

      expect(visible[0].product_name).toBe("Milch");
    });

    it("falls back to en when the migrated product has no entry for the requested locale", async () => {
      await createSeededProduct({
        product_name: { en: "Milk", de: "Milch" },
      });
      const userId = new mongoose.Types.ObjectId().toString();

      const visible = await productService.getVisibleProducts(userId, "es");

      expect(visible[0].product_name).toBe("Milk");
    });

    it("displays a not-yet-migrated (plain string) seeded product unchanged regardless of locale", async () => {
      await createSeededProduct({ product_name: "Eggs" });
      const userId = new mongoose.Types.ObjectId().toString();

      const visible = await productService.getVisibleProducts(userId, "ru");

      expect(visible[0].product_name).toBe("Eggs");
    });

    it("displays a user-created item's name exactly as typed regardless of locale", async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      await createSeededProduct({
        product_name: "Moje batérie",
        owner: userId,
      });

      const visible = await productService.getVisibleProducts(userId, "ru");

      expect(visible[0].product_name).toBe("Moje batérie");
    });
  });

  describe("getOwnedProducts", () => {
    it("returns _id as a plain string, not a raw ObjectId", async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const owned = await createSeededProduct({ owner: userId });

      const [product] = await productService.getOwnedProducts(userId, "en");

      expect(typeof product._id).toBe("string");
      expect(product._id).toBe(owned._id.toString());
    });

    it("returns only the given user's own products, excluding seeded and other users' items", async () => {
      const userA = new mongoose.Types.ObjectId().toString();
      const userB = new mongoose.Types.ObjectId().toString();

      await createSeededProduct({ product_name: "seeded item" });
      await createSeededProduct({ product_name: "user a's item", owner: userA });
      await createSeededProduct({ product_name: "user b's item", owner: userB });

      const owned = await productService.getOwnedProducts(userA, "en");

      expect(owned.map((p) => p.product_name)).toEqual(["user a's item"]);
    });
  });

  describe("updateOwnedProduct", () => {
    it("renames the item and persists the change", async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const owned = await createSeededProduct({
        product_name: "Choco",
        owner: userId,
      });

      const result = await productService.updateOwnedProduct(
        userId,
        owned._id.toString(),
        { name: "Chocolate" },
      );

      expect(result.ok).toBe(true);
      const persisted = await Product.findById(owned._id);
      expect(persisted?.product_name).toBe("Chocolate");
    });

    it("recategorizes the item and persists the change", async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const owned = await createSeededProduct({
        category: "sweets",
        owner: userId,
      });

      const result = await productService.updateOwnedProduct(
        userId,
        owned._id.toString(),
        { category: "chips-snacks" },
      );

      expect(result.ok).toBe(true);
      const persisted = await Product.findById(owned._id);
      expect(persisted?.category).toBe("chips-snacks");
    });

    it("rejects an unknown category without persisting the change", async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const owned = await createSeededProduct({
        category: "sweets",
        owner: userId,
      });

      const result = await productService.updateOwnedProduct(
        userId,
        owned._id.toString(),
        { category: "not-a-real-category" },
      );

      expect(result.ok).toBe(false);
      const persisted = await Product.findById(owned._id);
      expect(persisted?.category).toBe("sweets");
    });

    it("refuses to edit another user's item", async () => {
      const owner = new mongoose.Types.ObjectId().toString();
      const attacker = new mongoose.Types.ObjectId().toString();
      const owned = await createSeededProduct({
        product_name: "Original",
        owner,
      });

      const result = await productService.updateOwnedProduct(
        attacker,
        owned._id.toString(),
        { name: "Hijacked" },
      );

      expect(result.ok).toBe(false);
      const persisted = await Product.findById(owned._id);
      expect(persisted?.product_name).toBe("Original");
    });
  });

  describe("deleteOwnedProduct", () => {
    it("removes the product from the catalog", async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const owned = await createSeededProduct({ owner: userId });

      const result = await productService.deleteOwnedProduct(
        userId,
        owned._id.toString(),
      );

      expect(result.ok).toBe(true);
      expect(await Product.findById(owned._id)).toBeNull();
    });

    it("cascades: removes the item from the owner's shopping list and likes", async () => {
      const user = await createUser();
      const owned = await createSeededProduct({ owner: user._id.toString() });

      user.listItems.push({
        productId: owned._id,
        quantity: 2,
        checked: false,
      });
      user.likedItems.push(owned._id);
      await user.save();

      await productService.deleteOwnedProduct(
        user._id.toString(),
        owned._id.toString(),
      );

      const persisted = await User.findById(user._id);
      expect(persisted?.listItems).toHaveLength(0);
      expect(persisted?.likedItems).toHaveLength(0);
    });

    it("refuses to delete another user's item, leaving it intact", async () => {
      const owner = new mongoose.Types.ObjectId().toString();
      const attacker = new mongoose.Types.ObjectId().toString();
      const owned = await createSeededProduct({ owner });

      const result = await productService.deleteOwnedProduct(
        attacker,
        owned._id.toString(),
      );

      expect(result.ok).toBe(false);
      expect(await Product.findById(owned._id)).not.toBeNull();
    });
  });

  describe("getVisibleProductsByIds", () => {
    it("excludes a matching id when it is owned by another user", async () => {
      const userA = new mongoose.Types.ObjectId().toString();
      const userB = new mongoose.Types.ObjectId().toString();

      const seeded = await createSeededProduct({ product_name: "seeded item" });
      const ownedByB = await createSeededProduct({
        product_name: "user b's item",
        owner: userB,
      });

      const visible = await productService.getVisibleProductsByIds(
        userA,
        [seeded._id.toString(), ownedByB._id.toString()],
        "en",
      );

      expect(visible.map((p) => p.product_name)).toEqual(["seeded item"]);
    });
  });
});
