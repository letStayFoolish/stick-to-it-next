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
    });

    const found = await Product.findById(created._id);

    expect(found?.product_name).toBe("apple");
  });

  it("persists a seeded document with no owner", async () => {
    const created = await Product.create({
      category: "fruit",
      product_name: "seeded apple",
    });

    const found = await Product.findById(created._id);

    expect(found?.owner).toBeUndefined();
  });

  it("persists a user-owned document with the owner id", async () => {
    const ownerId = new mongoose.Types.ObjectId();

    const created = await Product.create({
      category: "fruit",
      product_name: "my custom apple",
      owner: ownerId,
    });

    const found = await Product.findById(created._id);

    expect(found?.owner?.toString()).toBe(ownerId.toString());
  });

  it("persists a document with no image field", async () => {
    const created = await Product.create({
      category: "fruit",
      product_name: "batteries",
    });

    const found = await Product.findById(created._id);

    expect(found?.product_name).toBe("batteries");
  });
});
