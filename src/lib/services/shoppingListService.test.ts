import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User } from "@/lib/models/User";
import * as shoppingListService from "@/lib/services/shoppingListService";

async function createUser() {
  return User.create({
    name: "Test User",
    email: `${Math.random()}@example.com`,
    password: "hashed-password",
  });
}

describe("shoppingListService", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe("addItem", () => {
    it("adds a new product to the user's list with quantity 1", async () => {
      const user = await createUser();
      const productId = new mongoose.Types.ObjectId().toString();

      await shoppingListService.addItem(user._id.toString(), productId);

      const persisted = await User.findById(user._id);
      expect(persisted?.listItems).toHaveLength(1);
      expect(persisted?.listItems[0].productId.toString()).toBe(productId);
      expect(persisted?.listItems[0].quantity).toBe(1);
    });

    it("does not duplicate or reset quantity when the product is already on the list", async () => {
      const user = await createUser();
      const productId = new mongoose.Types.ObjectId().toString();

      user.listItems.push({ productId, quantity: 5, checked: false });
      await user.save();

      await shoppingListService.addItem(user._id.toString(), productId);

      const persisted = await User.findById(user._id);
      expect(persisted?.listItems).toHaveLength(1);
      expect(persisted?.listItems[0].quantity).toBe(5);
    });
  });

  describe("setQuantity", () => {
    it("sets the item's quantity to the given absolute value", async () => {
      const user = await createUser();
      const productId = new mongoose.Types.ObjectId().toString();
      user.listItems.push({ productId, quantity: 1, checked: false });
      await user.save();

      await shoppingListService.setQuantity(
        user._id.toString(),
        productId,
        7,
      );

      const persisted = await User.findById(user._id);
      expect(persisted?.listItems[0].quantity).toBe(7);
    });

    it("clamps quantity to a maximum of 100", async () => {
      const user = await createUser();
      const productId = new mongoose.Types.ObjectId().toString();
      user.listItems.push({ productId, quantity: 1, checked: false });
      await user.save();

      await shoppingListService.setQuantity(
        user._id.toString(),
        productId,
        250,
      );

      const persisted = await User.findById(user._id);
      expect(persisted?.listItems[0].quantity).toBe(100);
    });

    it("removes the item from the list when quantity is set to 0", async () => {
      const user = await createUser();
      const productId = new mongoose.Types.ObjectId().toString();
      user.listItems.push({ productId, quantity: 1, checked: false });
      await user.save();

      await shoppingListService.setQuantity(
        user._id.toString(),
        productId,
        0,
      );

      const persisted = await User.findById(user._id);
      expect(persisted?.listItems).toHaveLength(0);
    });

    it("throws when the product is not on the user's list", async () => {
      const user = await createUser();
      const productId = new mongoose.Types.ObjectId().toString();

      await expect(
        shoppingListService.setQuantity(user._id.toString(), productId, 5),
      ).rejects.toThrow();
    });
  });

  describe("setChecked", () => {
    it("persists the checked state so it survives a fresh re-fetch", async () => {
      const user = await createUser();
      const productId = new mongoose.Types.ObjectId().toString();
      user.listItems.push({ productId, quantity: 1, checked: false });
      await user.save();

      await shoppingListService.setChecked(
        user._id.toString(),
        productId,
        true,
      );

      // Simulate a full page reload: re-fetch the document from scratch
      // rather than inspecting the object the service returned.
      const reloaded = await User.findById(user._id);
      expect(reloaded?.listItems[0].checked).toBe(true);
    });
  });

  describe("setNotes", () => {
    it("persists the note text so it survives a fresh re-fetch", async () => {
      const user = await createUser();

      await shoppingListService.setNotes(user._id.toString(), "budget 50€");

      const persisted = await User.findById(user._id);
      expect(persisted?.notes).toBe("budget 50€");
    });

    it("overwrites an existing note with an empty string to clear it", async () => {
      const user = await createUser();
      user.notes = "return bottles";
      await user.save();

      await shoppingListService.setNotes(user._id.toString(), "");

      const persisted = await User.findById(user._id);
      expect(persisted?.notes).toBe("");
    });
  });

  describe("clearList", () => {
    it("empties the list and resets notes", async () => {
      const user = await createUser();
      user.listItems.push({
        productId: new mongoose.Types.ObjectId(),
        quantity: 3,
        checked: true,
      });
      user.notes = "milk, eggs";
      await user.save();

      await shoppingListService.clearList(user._id.toString());

      const persisted = await User.findById(user._id);
      expect(persisted?.listItems).toHaveLength(0);
      expect(persisted?.notes).toBe("");
    });
  });

  describe("toggleLiked", () => {
    it("adds the product to likedItems when it isn't already liked", async () => {
      const user = await createUser();
      const productId = new mongoose.Types.ObjectId().toString();

      await shoppingListService.toggleLiked(user._id.toString(), productId);

      const persisted = await User.findById(user._id);
      expect(
        persisted?.likedItems.map((id: any) => id.toString()),
      ).toContain(productId);
    });

    it("removes the product from likedItems when it is already liked", async () => {
      const user = await createUser();
      const productId = new mongoose.Types.ObjectId();
      user.likedItems.push(productId);
      await user.save();

      await shoppingListService.toggleLiked(
        user._id.toString(),
        productId.toString(),
      );

      const persisted = await User.findById(user._id);
      expect(persisted?.likedItems).toHaveLength(0);
    });
  });
});
