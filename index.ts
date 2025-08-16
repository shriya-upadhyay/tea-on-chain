require('dotenv').config();
const mongoose = require('mongoose');

// Replace with your actual connection string from MongoDB Atlas
const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err: any) => console.error("❌ MongoDB connection error:", err));