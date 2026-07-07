import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Product } from "@/lib/models/Product";
import * as productService from "@/lib/services/productService";

function createSeededProduct(overrides: Record<string, unknown> = {}) {
  return Product.create({
    category: "fruits",
    product_name: "seeded apple",
    ...overrides,
  });
}

describe("productService", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterEach(async () => {
    await Product.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe("getVisibleProducts", () => {
    it("includes seeded products for any user", async () => {
      await createSeededProduct();
      const userId = new mongoose.Types.ObjectId().toString();

      const visible = await productService.getVisibleProducts(userId);

      expect(visible).toHaveLength(1);
      expect(visible[0].product_name).toBe("seeded apple");
    });

    it("includes a user's own product but excludes another user's product", async () => {
      const userA = new mongoose.Types.ObjectId().toString();
      const userB = new mongoose.Types.ObjectId().toString();

      await createSeededProduct({ product_name: "user a's item", owner: userA });
      await createSeededProduct({ product_name: "user b's item", owner: userB });

      const visibleToA = await productService.getVisibleProducts(userA);
      const visibleToB = await productService.getVisibleProducts(userB);

      expect(visibleToA.map((p) => p.product_name)).toEqual(["user a's item"]);
      expect(visibleToB.map((p) => p.product_name)).toEqual(["user b's item"]);
    });

    it("excludes owned products from an anonymous (no user) request", async () => {
      const userA = new mongoose.Types.ObjectId().toString();
      await createSeededProduct({ product_name: "user a's item", owner: userA });
      await createSeededProduct({ product_name: "seeded item" });

      const visible = await productService.getVisibleProducts(null);

      expect(visible.map((p) => p.product_name)).toEqual(["seeded item"]);
    });

    it("does not expose the raw owner reference on an owned product", async () => {
      const userA = new mongoose.Types.ObjectId().toString();
      await createSeededProduct({ product_name: "user a's item", owner: userA });

      const visible = await productService.getVisibleProducts(userA);

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

  describe("getVisibleProductsByIds", () => {
    it("excludes a matching id when it is owned by another user", async () => {
      const userA = new mongoose.Types.ObjectId().toString();
      const userB = new mongoose.Types.ObjectId().toString();

      const seeded = await createSeededProduct({ product_name: "seeded item" });
      const ownedByB = await createSeededProduct({
        product_name: "user b's item",
        owner: userB,
      });

      const visible = await productService.getVisibleProductsByIds(userA, [
        seeded._id.toString(),
        ownedByB._id.toString(),
      ]);

      expect(visible.map((p) => p.product_name)).toEqual(["seeded item"]);
    });
  });
});
