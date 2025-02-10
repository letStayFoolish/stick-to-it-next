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
    // finally {
    //   isConnected = false;
    //   await mongoose.disconnect();
    // }
  } else {
    console.log(" ⚠️ MongoDB is already connected ⚠️ ");
    return;
  }
};

export default connectDB;
