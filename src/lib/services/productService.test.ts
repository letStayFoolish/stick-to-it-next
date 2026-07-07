import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Product } from "@/lib/models/Product";
import * as productService from "@/lib/services/productService";

function createSeededProduct(overrides: Record<string, unknown> = {}) {
  return Product.create({
    category: "fruits",
    product_name: "seeded apple",
    product_image: "apple.png",
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
