import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  const { MONGODB_URI } = process.env;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in your environment variables");
  }
  mongoose.set("strictQuery", true); // this insuring that only the fields that are specified in our model schema will be saved in our database
  // If the database is already connected, don't connect again
  if (!isConnected) {
    try {
      isConnected = true;
      await mongoose.connect(MONGODB_URI!);
      console.log("MongoDB connected ✅ ");
    } catch (error) {
      isConnected = false;
      console.log("Failed to connect to MongoDB", error);
      throw new Error("Failed to connect to MongoDB");
    }
  } else {
    console.log(" ⚠️ MongoDB is already connected ⚠️ ");
    return;
  }
};

export default connectDB;

/**
 * if (!MONGODB_URI) {
 *   throw new Error("Please define the MONGODB_URI environment variable");
 * }
 *
 * let cached = global.mongoose || { conn: null, promise: null };
 *
 * export async function connectToDB() {
 *   if (cached.conn) return cached.conn;
 *   if (!cached.promise) {
 *     cached.promise = mongoose.connect(MONGODB_URI, {
 *       useNewUrlParser: true,
 *       useUnifiedTopology: true,
 *     });
 *   }
 *   cached.conn = await cached.promise;
 *   return cached.conn;
 * }
 */
