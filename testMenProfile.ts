import dotenv from 'dotenv';
import mongoose from 'mongoose';
import MenProfile from './models/menProfile';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const uri = process.env.MONGO_URI;
mongoose.connect(uri!)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Create a test men profile
async function createTestProfile() {
  try {
    const testProfile = new MenProfile({
      uuid: "test-uuid-12345",
      firstName: "John",
      lastName: "Doe",
      instagram: "@johndoe",
      linkedin: "linkedin.com/in/johndoe",
      facebook: "facebook.com/johndoe",
      reviews: [], // Empty array for now
      checks: []   // Empty array for now
    });

    const savedProfile = await testProfile.save();
    console.log("✅ Test men profile created successfully:");
    console.log(savedProfile);
    
    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error creating test profile:", error);
    mongoose.connection.close();
  }
}

// Run the test
createTestProfile();
