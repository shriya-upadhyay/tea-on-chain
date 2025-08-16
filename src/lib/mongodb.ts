import 'dotenv/config';
import mongoose from 'mongoose';

const uri = process.env.MONGO_URI;

export default async function connectDB() {
  await mongoose.connect(uri!);
}

mongoose.connect(uri!)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err: any) => console.error("❌ MongoDB connection error:", err));