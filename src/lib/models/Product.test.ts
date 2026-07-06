import { afterAll, beforeAll, describe, expect, it } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Product } from "@/lib/models/Product";

describe("Product model", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("persists and reads back a document", async () => {
    const created = await Product.create({
      category: "fruit",
      product_name: "apple",
      product_image: "apple.png",
    });

    const found = await Product.findById(created._id);

    expect(found?.product_name).toBe("apple");
  });
});
