const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/resume_analyzer';
  try {
    // Attempt connection with 3s timeout to avoid blocking startup if DB is offline
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to ${uri}`);
  } catch (err) {
    isConnected = false;
    console.warn(`[MongoDB] Warning: Could not connect to MongoDB (${err.message}).`);
    console.warn(`[MongoDB] Operating in graceful in-memory/file fallback mode for history storage.`);
  }
};

const isDbConnected = () => isConnected;

module.exports = { connectDB, isDbConnected };
