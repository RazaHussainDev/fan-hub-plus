const AudioTrack = require('../models/AudioTrack');

// ─── Initial Seed Audio Tracks ──────────────────────────────────────────────────────
const SEED_AUDIO = [
  {
    title: 'I Really Want to Stay at Your House',
    artist: 'Rosa Walton & Hallie Coggins',
    fandom: 'Cyberpunk 2077',
    category: 'Gaming',
    type: 'OST / Soundtrack',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    duration: '4:06',
    plays: 12500,
    likes: 2400
  },
  {
    title: 'Enemy (Arcane Championship Version)',
    artist: 'Imagine Dragons & JID',
    fandom: 'League of Legends',
    category: 'TV Shows',
    type: 'Theme Song',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverImage: 'https://image.tmdb.org/t/p/w780/5cvnxEHT3e39DvT6ARw4GNCFrB0.jpg',
    duration: '3:34',
    plays: 18900,
    likes: 3100
  },
  {
    title: 'The Rumbling (Full Epic Orchestra)',
    artist: 'SiM & Tokyo Philharmonic',
    fandom: 'Attack on Titan',
    category: 'Anime',
    type: 'OST / Soundtrack',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverImage: 'https://image.tmdb.org/t/p/w780/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg',
    duration: '3:40',
    plays: 15400,
    likes: 2980
  },
  {
    title: 'Gurenge (Demon Slayer Main Theme)',
    artist: 'LiSA',
    fandom: 'Demon Slayer',
    category: 'Anime',
    type: 'Theme Song',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    coverImage: 'https://image.tmdb.org/t/p/w780/3GQKYh6Trm8pxd2AypovoYQf4Ay.jpg',
    duration: '3:58',
    plays: 14200,
    likes: 2750
  },
  {
    title: 'The Final Battle (Radagon & Elden Beast)',
    artist: 'Tsukasa Saitoh',
    fandom: 'Elden Ring',
    category: 'Gaming',
    type: 'OST / Soundtrack',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    coverImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80',
    duration: '4:45',
    plays: 9800,
    likes: 1890
  },
  {
    title: 'Am I Dreaming (Multiverse Suite)',
    artist: 'Metro Boomin, A$AP Rocky',
    fandom: 'Marvel Universe',
    category: 'Movies',
    type: 'OST / Soundtrack',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    coverImage: 'https://image.tmdb.org/t/p/w780/kVd3a9YeLGkoeR50jGEXM6EqseS.jpg',
    duration: '4:16',
    plays: 16700,
    likes: 3420
  },
  {
    title: 'Euphoria (Acoustic Fandom Sessions)',
    artist: 'BTS (ARMY Tribute)',
    fandom: 'BTS (ARMY)',
    category: 'K-Pop',
    type: 'Remix',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    duration: '3:49',
    plays: 21300,
    likes: 4890
  },
  {
    title: 'Fandom Universe Podcast: Ep 1 - Anime & Gaming Era',
    artist: 'Fan Hub Plus Original Studio',
    fandom: 'Multiverse',
    category: 'Anime',
    type: 'Podcast',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    coverImage: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80',
    duration: '12:20',
    plays: 8700,
    likes: 1540
  }
];

// Helper to seed audio if empty
async function ensureAudioSeedData() {
  try {
    const count = await AudioTrack.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding initial Audio & Soundtracks catalog...');
      await AudioTrack.insertMany(SEED_AUDIO);
      console.log('✅ Seeded 8 fandom audio soundtracks & podcasts.');
    }
  } catch (err) {
    console.error('Audio seed warning:', err.message);
  }
}

// ─── Controller Methods ─────────────────────────────────────────────────────────────

// GET /api/audio
exports.getAudioTracks = async (req, res) => {
  try {
    await ensureAudioSeedData();
    const { category, type, fandom, search } = req.query;
    const query = { isPublished: true };

    if (category && category !== 'All' && category !== 'all') {
      query.category = new RegExp(`^${category.trim()}$`, 'i');
    }

    if (type && type !== 'All' && type !== 'all') {
      query.type = type;
    }

    if (fandom && fandom !== 'All' && fandom !== 'all') {
      query.fandom = new RegExp(fandom.trim(), 'i');
    }

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { title: { $regex: s, $options: 'i' } },
        { artist: { $regex: s, $options: 'i' } },
        { fandom: { $regex: s, $options: 'i' } }
      ];
    }

    const tracks = await AudioTrack.find(query).sort({ plays: -1, likes: -1 });
    res.status(200).json({ success: true, count: tracks.length, results: tracks });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch audio tracks' });
  }
};

// PATCH /api/audio/:id/like
exports.likeAudioTrack = async (req, res) => {
  try {
    const track = await AudioTrack.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!track) return res.status(404).json({ success: false, message: 'Track not found' });
    res.status(200).json({ success: true, likes: track.likes });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/audio/:id/play
exports.registerPlay = async (req, res) => {
  try {
    const track = await AudioTrack.findByIdAndUpdate(
      req.params.id,
      { $inc: { plays: 1 } },
      { new: true }
    );
    res.status(200).json({ success: true, plays: track?.plays || 0 });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};
