const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://root:password@mongo:27017/tasks?authSource=admin", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected (task Service)");
  } catch (err) {
    console.error("❌ MongoDB connection error (task Service):", err);
    process.exit(1);
  }
};

module.exports = connectDB;
