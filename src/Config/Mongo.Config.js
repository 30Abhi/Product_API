import mongoose from "mongoose";
import "dotenv/config"; // To load environment variables from .env file

export const MongoConfig = async () => {
  try {
    const dbUri = process.env.MONGO_URI; // MongoDB connection string from .env
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit the process if the connection fails
  }
};