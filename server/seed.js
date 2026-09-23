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

    // 3. Insert the WebTorrent test stream
    const newStream = await EpisodeStream.create({
      tmdbId: targetTmdbId,
      season: targetSeason,
      episode: targetEpisode,
      streamUrl: "http://dummy", // not used when magnet is present, but required by schema
      isMultiAudio: true,
      magnetURI: "magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel"
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
