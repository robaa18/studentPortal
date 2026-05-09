import mongoose from "mongoose";
import { MONGODB_URI } from "../../config/config.service.js";
import chalk from "chalk";
 
const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is missing. Add it to backend/.env");
    }
    await mongoose.connect(MONGODB_URI);
    console.log( "Connected to MongoDB successfully");
  } catch (error) {
    console.log(chalk.bgRedBright.white("Error connecting to MongoDB:"), error);
    throw error;
  }
};
export default connectDB;
