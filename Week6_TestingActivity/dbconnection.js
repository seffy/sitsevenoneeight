require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB connection
const connectToDatabase = async () => {
  try {
    const uri = process.env.MONGO_URI;
    const dbName = process.env.DB_NAME;

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: dbName,
    });

    console.log(`Connected to MongoDB Atlas database: ${dbName}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectToDatabase;