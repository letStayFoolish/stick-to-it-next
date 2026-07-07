/**
 * Seeds (or migrates) the catalog's seeded products from
 * `data/products.seed.json` into MongoDB.
 *
 * Idempotent and additive: matches an existing product by category + English
 * name (whether that name is still a plain string, not-yet-migrated, or
 * already a locale-keyed object), then sets its `product_name` to the full
 * locale-keyed object from the data file. No match creates a new document,
 * so this script can rebuild the whole catalog from an empty database.
 *
 * Never touches user-created products (owner is never set here) or any
 * other field. Run with: node scripts/seed-products.js
 */
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

async function main() {
  loadEnvLocal();

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set (checked .env.local and env)");
  }

  const seedPath = path.join(__dirname, "..", "data", "products.seed.json");
  const seedEntries = JSON.parse(fs.readFileSync(seedPath, "utf8"));

  await mongoose.connect(uri);
  console.log(`Connected. Seeding ${seedEntries.length} products...`);

  const ProductSchema = new mongoose.Schema(
    {
      category: { type: String, required: true },
      product_name: { type: mongoose.Schema.Types.Mixed, required: true },
      isLiked: { type: Boolean, default: false },
      owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true },
  );
  const Product =
    mongoose.models.Product || mongoose.model("Product", ProductSchema);

  let created = 0;
  let migrated = 0;

  for (const entry of seedEntries) {
    const { category, en, ru, sr, es, de } = entry;
    const productName = { en, ru, sr, es, de };

    const matchFilter = {
      category,
      owner: { $exists: false },
      $or: [{ product_name: en }, { "product_name.en": en }],
    };

    const existing = await Product.findOne(matchFilter).select("_id");

    await Product.findOneAndUpdate(
      matchFilter,
      { $set: { category, product_name: productName } },
      { upsert: true },
    );

    if (existing) {
      migrated += 1;
    } else {
      created += 1;
    }
  }

  console.log(`Done. Created ${created}, migrated ${migrated}.`);

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
