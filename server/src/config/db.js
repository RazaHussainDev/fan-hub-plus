const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    mongoose.set('bufferCommands', false); // Globally disable buffering
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4, 
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });
    console.log(`✅  MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌  MongoDB Connection Error: ${error.message}`);
    // DO NOT process.exit(1) here during development if you want the server to stay alive
    // Let the server run so frontend doesn't get connection refused, just API errors
  }
};

module.exports = connectDB;
