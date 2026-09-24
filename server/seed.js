require('dotenv').config();
const mongoose = require('mongoose');
const EpisodeStream = require('./src/models/EpisodeStream');

const seedDatabase = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected for seeding...');

    // 2. Delete ALL existing records to clear overrides
    await EpisodeStream.deleteMany({});
    console.log(`🧹 Cleared all existing records in EpisodeStream database.`);

    console.log('🎉 Successfully wiped EpisodeStream database overrides!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during database seeding:', error.message);
    process.exit(1);
  }
};

seedDatabase();
