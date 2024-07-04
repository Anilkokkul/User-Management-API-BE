const mongoose = require("mongoose");

exports.db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB...");
  } catch (error) {
    console.log("Error while connecting DB...", error);
  }
};
