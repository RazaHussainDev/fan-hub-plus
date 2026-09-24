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
    const targetEpisode = 1;

    // 2. Delete any existing records for this specific episode
    await EpisodeStream.deleteMany({
      tmdbId: targetTmdbId,
      season: targetSeason,
      episode: targetEpisode
    });
    console.log(`🧹 Cleared existing records for TMDB: ${targetTmdbId} S${targetSeason}E${targetEpisode}`);

    // 3. Insert the WebTorrent test stream (Fallback for UI stability)
    const newStream = await EpisodeStream.create({
      tmdbId: targetTmdbId,
      season: targetSeason,
      episode: targetEpisode,
      streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      isMultiAudio: true,
      magnetURI: null
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
