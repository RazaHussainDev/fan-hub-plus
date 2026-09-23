require('dotenv').config();
const mongoose = require('mongoose');
const EpisodeStream = require('./src/models/EpisodeStream');

const seedDatabase = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected for seeding...');

    const targetTmdbId = "71446";
    const targetSeason = 1;
    const targetEpisode = 4;

    // 2. Delete any existing records for this specific episode
    await EpisodeStream.deleteMany({
      tmdbId: targetTmdbId,
      season: targetSeason,
      episode: targetEpisode
    });
    console.log(`🧹 Cleared existing records for TMDB: ${targetTmdbId} S${targetSeason}E${targetEpisode}`);

    // 3. Insert the Apple Advanced Multi-Audio HLS test stream
    const newStream = await EpisodeStream.create({
      tmdbId: targetTmdbId,
      season: targetSeason,
      episode: targetEpisode,
      streamUrl: "https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8",
      isMultiAudio: true
    });

    console.log('🎉 Successfully seeded EpisodeStream database override:');
    console.log(newStream);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during database seeding:', error.message);
    process.exit(1);
  }
};

seedDatabase();
