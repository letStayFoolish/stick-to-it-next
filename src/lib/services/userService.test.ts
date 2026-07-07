import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User } from "@/lib/models/User";
import * as userService from "@/lib/services/userService";

function createUser(overrides: Record<string, unknown> = {}) {
  return User.create({
    name: "Test User",
    email: `${Math.random()}@example.com`,
    password: "hashed-password",
    ...overrides,
  });
}

describe("userService", () => {
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

  describe("setLanguage", () => {
    it("persists the language preference on the user document", async () => {
      const user = await createUser();

      await userService.setLanguage(user._id.toString(), "de");

      const persisted = await User.findById(user._id);
      expect(persisted?.language).toBe("de");
    });
  });

  describe("getLanguage", () => {
    it("returns null when the user has no stored preference", async () => {
      const user = await createUser();

      expect(await userService.getLanguage(user._id.toString())).toBeNull();
    });

    it("returns the stored preference", async () => {
      const user = await createUser({ language: "sr" });

      expect(await userService.getLanguage(user._id.toString())).toBe("sr");
    });
  });
});
