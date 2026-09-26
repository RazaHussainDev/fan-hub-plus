const FandomContent = require('../models/FandomContent');

// ─── Initial Seed Content across all 8 Fandom Categories ─────────────────────────────
const SEED_DATA = [
  // Anime
  {
    title: 'Jujutsu Kaisen: Shibuya Incident',
    category: 'Anime',
    fandom: 'Jujutsu Kaisen',
    type: 'video',
    description: 'Special Grade sorcerers and cursed spirits collide in a battle for Tokyo that transforms the jujutsu world forever.',
    poster: 'https://image.tmdb.org/t/p/w780/hDzgFfnjA5t32n0rR13d5yqP1sN.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/9P4IIMYY3HifqeruZq0ZZ9g7YUi.jpg',
    genres: ['Action', 'Supernatural', 'Shonen'],
    releaseYear: 2023,
    rating: 9.4,
    popularity: 99,
    streamUrl: 'https://vidsrc.me/embed/tv?tmdb=95479',
    tags: ['Cursed Energy', 'Gojo Satoru', 'Shibuya Arc', 'MAPPA'],
    featured: true
  },
  {
    title: 'Demon Slayer: Hashira Training Arc',
    category: 'Anime',
    fandom: 'Demon Slayer',
    type: 'video',
    description: 'Tanjiro and the Demon Slayer Corps undergo rigorous training with the elite Hashira in preparation for Muzan Kibutsuji.',
    poster: 'https://image.tmdb.org/t/p/w780/3GQKYh6Trm8pxd2AypovoYQf4Ay.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/3GQKYh6Trm8pxd2AypovoYQf4Ay.jpg',
    genres: ['Action', 'Fantasy', 'Shonen'],
    releaseYear: 2024,
    rating: 9.2,
    popularity: 96,
    streamUrl: 'https://vidsrc.me/embed/tv?tmdb=85937',
    tags: ['Hashira', 'Ufotable', 'Breathing Styles'],
    featured: true
  },
  {
    title: 'Attack on Titan: The Final Chapters',
    category: 'Anime',
    fandom: 'Attack on Titan',
    type: 'video',
    description: 'The Rumbling marches across humanity as former allies unite in a desperate bid to stop Eren Yeager.',
    poster: 'https://image.tmdb.org/t/p/w780/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg',
    genres: ['Dark Fantasy', 'Action', 'Drama'],
    releaseYear: 2023,
    rating: 9.6,
    popularity: 97,
    streamUrl: 'https://vidsrc.me/embed/tv?tmdb=1429',
    tags: ['Eren Yeager', 'The Rumbling', 'Scout Regiment']
  },

  // Gaming
  {
    title: 'Cyberpunk 2077: Phantom Liberty',
    category: 'Gaming',
    fandom: 'Cyberpunk Universe',
    type: 'video',
    description: 'An espionage-thriller expansion set in the walled-off district of Dogtown with secret agent Solomon Reed and Johnny Silverhand.',
    poster: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1920&q=80',
    genres: ['RPG', 'Sci-Fi', 'Cyberpunk', 'Action'],
    releaseYear: 2023,
    rating: 9.5,
    popularity: 98,
    tags: ['Night City', 'Keanu Reeves', 'Idris Elba', 'CDPR'],
    featured: true
  },
  {
    title: 'Elden Ring: Shadow of the Erdtree',
    category: 'Gaming',
    fandom: 'Soulsborne',
    type: 'video',
    description: 'Guided by Empyrean Miquella, players step into the Land of Shadow, a place obscured by the Erdtree where Marika first set foot.',
    poster: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1920&q=80',
    genres: ['Action RPG', 'Dark Fantasy', 'Open World'],
    releaseYear: 2024,
    rating: 9.8,
    popularity: 100,
    tags: ['FromSoftware', 'Miquella', 'Messmer', 'Lands Between'],
    featured: true
  },
  {
    title: 'Genshin Impact: Fontaine Archon Saga',
    category: 'Gaming',
    fandom: 'Genshin Impact',
    type: 'video',
    description: 'The Nation of Hydro awaits with court dramas, secrets of the ancient prophecy, and the enigmatic Archon Furina.',
    poster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=80',
    genres: ['Open World', 'Action RPG', 'Fantasy'],
    releaseYear: 2024,
    rating: 9.0,
    popularity: 93,
    tags: ['HoYoverse', 'Teyvat', 'Furina', 'Hydro Archon']
  },

  // Movies
  {
    title: 'Dune: Part Two',
    category: 'Movies',
    fandom: 'Dune Universe',
    type: 'stream',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    poster: 'https://image.tmdb.org/t/p/w780/eZ239CUp1d6OryZEBPnO2n87gMG.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/eZ239CUp1d6OryZEBPnO2n87gMG.jpg',
    genres: ['Sci-Fi', 'Adventure', 'Epic'],
    releaseYear: 2024,
    rating: 9.5,
    popularity: 99,
    streamUrl: 'https://vidsrc.me/embed/movie?tmdb=693134',
    tags: ['Arrakis', 'Denis Villeneuve', 'Sandworms', 'MuadDib'],
    featured: true
  },
  {
    title: 'Spider-Man: Across the Spider-Verse',
    category: 'Movies',
    fandom: 'Marvel Universe',
    type: 'stream',
    description: 'Miles Morales catapults across the Multiverse, encountering a team of Spider-People charged with protecting its very existence.',
    poster: 'https://image.tmdb.org/t/p/w780/kVd3a9YeLGkoeR50jGEXM6EqseS.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/kVd3a9YeLGkoeR50jGEXM6EqseS.jpg',
    genres: ['Animation', 'Action', 'Superhero', 'Sci-Fi'],
    releaseYear: 2023,
    rating: 9.6,
    popularity: 98,
    streamUrl: 'https://vidsrc.me/embed/movie?tmdb=569094',
    tags: ['Spider-Verse', 'Miles Morales', 'Gwen Stacy', 'Multiverse']
  },

  // TV Shows
  {
    title: 'Arcane: League of Legends Season 2',
    category: 'TV Shows',
    fandom: 'League of Legends',
    type: 'stream',
    description: 'The delicate balance between the rich city of Piltover and the seedy underbelly of Zaun reaches a catastrophic boiling point.',
    poster: 'https://image.tmdb.org/t/p/w780/5cvnxEHT3e39DvT6ARw4GNCFrB0.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/5cvnxEHT3e39DvT6ARw4GNCFrB0.jpg',
    genres: ['Animation', 'Sci-Fi', 'Action', 'Fantasy'],
    releaseYear: 2024,
    rating: 9.8,
    popularity: 100,
    streamUrl: 'https://vidsrc.me/embed/tv?tmdb=94605',
    tags: ['Vi', 'Jinx', 'Piltover', 'Zaun', 'Riot Games'],
    featured: true
  },
  {
    title: 'Stranger Things: The Upside Down',
    category: 'TV Shows',
    fandom: 'Stranger Things',
    type: 'stream',
    description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
    poster: 'https://image.tmdb.org/t/p/w780/9P4IIMYY3HifqeruZq0ZZ9g7YUi.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/9P4IIMYY3HifqeruZq0ZZ9g7YUi.jpg',
    genres: ['Sci-Fi', 'Horror', 'Mystery'],
    releaseYear: 2023,
    rating: 9.2,
    popularity: 95,
    streamUrl: 'https://vidsrc.me/embed/tv?tmdb=66732',
    tags: ['Hawkins', 'Eleven', 'Demogorgon', '80s Nostalgia']
  },

  // K-Pop
  {
    title: 'BTS: Yet to Come in Cinemas',
    category: 'K-Pop',
    fandom: 'BTS (ARMY)',
    type: 'video',
    description: 'A close-up live recording of BTS performing their greatest hits before a crowd of 50,000 fans in Busan.',
    poster: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920&q=80',
    genres: ['Music', 'Concert', 'K-Pop', 'Performance'],
    releaseYear: 2023,
    rating: 9.7,
    popularity: 97,
    tags: ['BTS', 'ARMY', 'Busan', 'Live Concert', 'BigHit'],
    featured: true
  },
  {
    title: 'BLACKPINK: Born Pink World Tour',
    category: 'K-Pop',
    fandom: 'BLACKPINK (BLINK)',
    type: 'video',
    description: 'Jisoo, Jennie, Rosé, and Lisa light up global stadiums with record-shattering stages, couture visuals, and unforgettable choreographies.',
    poster: 'https://image.tmdb.org/t/p/w780/vpo3qdjgasu2kxHIKkNIXK9hDHM.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/vpo3qdjgasu2kxHIKkNIXK9hDHM.jpg',
    genres: ['Music', 'K-Pop', 'Choreography', 'Pop'],
    releaseYear: 2024,
    rating: 9.5,
    popularity: 96,
    tags: ['BLINK', 'YG Entertainment', 'World Tour', 'Pink Venom']
  },
  {
    title: 'Stray Kids: 5-STAR Dome Tour Special',
    category: 'K-Pop',
    fandom: 'Stray Kids (STAY)',
    type: 'video',
    description: 'Self-producing sensation Stray Kids dominates Japan and Korea dome arenas with explosive live energy and thunderous beats.',
    poster: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=80',
    genres: ['Music', 'K-Pop', 'Hip-Hop', 'Concert'],
    releaseYear: 2024,
    rating: 9.3,
    popularity: 92,
    tags: ['JYP', 'STAY', 'Bang Chan', 'Gods Menu']
  },

  // Comics
  {
    title: 'Batman: The Court of Owls Chronicle',
    category: 'Comics',
    fandom: 'DC Comics',
    type: 'article',
    description: 'Deep beneath the architecture of Gotham City lies an ancient secret society controlling its destiny with immortal assassins: The Talons.',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1920&q=80',
    genres: ['Superhero', 'Mystery', 'Noir', 'Action'],
    releaseYear: 2023,
    rating: 9.6,
    popularity: 94,
    tags: ['Batman', 'Scott Snyder', 'Gotham', 'Court of Owls'],
    featured: true
  },
  {
    title: 'Secret Wars: Incursions of the Multiverse',
    category: 'Comics',
    fandom: 'Marvel Universe',
    type: 'article',
    description: 'When parallel Earths collide, the heroes of Marvel must choose between saving their reality or sacrificing trillions across infinity.',
    poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1920&q=80',
    genres: ['Superhero', 'Sci-Fi', 'Epic'],
    releaseYear: 2024,
    rating: 9.3,
    popularity: 91,
    tags: ['Jonathan Hickman', 'Doctor Doom', 'Avengers', 'Incursions']
  },

  // Manga
  {
    title: 'Solo Leveling: Shadow Monarch Arise',
    category: 'Manga',
    fandom: 'Solo Leveling',
    type: 'article',
    description: 'In a world where hunters must battle deadly monsters, Sung Jin-woo, the weakest E-rank hunter, awakens a secret quest system.',
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920&q=80',
    genres: ['Action', 'Fantasy', 'Webtoon', 'Supernatural'],
    releaseYear: 2024,
    rating: 9.8,
    popularity: 100,
    tags: ['Sung Jin-Woo', 'D-Rank Dungeon', 'Shadow Army', 'Chugong'],
    featured: true
  },
  {
    title: 'Chainsaw Man: Academy Arc Chronicles',
    category: 'Manga',
    fandom: 'Chainsaw Man',
    type: 'article',
    description: 'Denji returns in high school while a new devil hunter named Asa Mitaka makes a contract with the War Devil to take him down.',
    poster: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=1920&q=80',
    genres: ['Dark Comedy', 'Action', 'Horror', 'Shonen'],
    releaseYear: 2024,
    rating: 9.2,
    popularity: 94,
    tags: ['Tatsuki Fujimoto', 'Denji', 'War Devil', 'Pochita']
  },

  // Cosplay
  {
    title: 'World Cosplay Summit: Masters of Crafting',
    category: 'Cosplay',
    fandom: 'Cosplay Guild',
    type: 'gallery',
    description: 'Grand showcase of award-winning armor crafts, foam smithing, animatronic wings, and breathtaking performance costuming from Tokyo.',
    poster: 'https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?w=1920&q=80',
    genres: ['Showcase', 'Costuming', 'Crafting', 'Performance'],
    releaseYear: 2024,
    rating: 9.7,
    popularity: 95,
    tags: ['WCS', 'Prop Making', 'Anime Expo', 'Armorsmithing'],
    featured: true
  },
  {
    title: 'Cyberpunk Neon Cosplay Exhibition',
    category: 'Cosplay',
    fandom: 'Cyberpunk Universe',
    type: 'gallery',
    description: 'Optical fiber wigs, functional LED cyberware, and hand-weathered tactical vests showcased by international master cosplayers.',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&q=80',
    genres: ['Sci-Fi', 'Crafting', 'Showcase', 'Lighting'],
    releaseYear: 2024,
    rating: 9.4,
    popularity: 91,
    tags: ['LED Costuming', 'Night City', 'Cyberware', 'EVA Foam']
  }
];

// Helper to auto-seed if empty
async function ensureSeedData() {
  try {
    const count = await FandomContent.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding initial Fandom Content catalog across all 8 categories...');
      await FandomContent.insertMany(SEED_DATA);
      console.log('✅ Seeded 18 high-quality Fandom items successfully.');
    }
  } catch (err) {
    console.error('Seed check warning:', err.message);
  }
}

// ─── Controller Methods ─────────────────────────────────────────────────────────────

// GET /api/fandom/explore
exports.getExploreContent = async (req, res) => {
  try {
    await ensureSeedData();

    const {
      category,
      genre,
      year,
      search,
      sort = 'popular',
      page = 1,
      limit = 24
    } = req.query;

    const query = { isPublished: true };

    // Category Filter
    if (category && category !== 'all' && category !== 'All Fandoms') {
      query.category = new RegExp(`^${category.trim()}$`, 'i');
    }

    // Genre Filter
    if (genre && genre !== 'all' && genre !== 'All Genres') {
      query.genres = { $in: [new RegExp(genre.trim(), 'i')] };
    }

    // Year Filter
    if (year && year !== 'all' && year !== 'All Years') {
      if (year === 'classic') {
        query.releaseYear = { $lt: 2020 };
      } else {
        query.releaseYear = Number(year);
      }
    }

    // Search Filter (Regex over title, fandom, description, and tags)
    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { title: { $regex: s, $options: 'i' } },
        { fandom: { $regex: s, $options: 'i' } },
        { description: { $regex: s, $options: 'i' } },
        { tags: { $in: [new RegExp(s, 'i')] } }
      ];
    }

    // Sorting Map
    let sortOptions = { popularity: -1 };
    if (sort === 'latest') {
      sortOptions = { releaseYear: -1, createdAt: -1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1 };
    } else if (sort === 'alpha') {
      sortOptions = { title: 1 };
    } else {
      sortOptions = { popularity: -1 };
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const total = await FandomContent.countDocuments(query);
    const data = await FandomContent.find(query)
                                   .sort(sortOptions)
                                   .skip(skip)
                                   .limit(limitNum);

    // Extract available genres for current filter
    const allGenres = await FandomContent.distinct('genres', { isPublished: true });

    res.status(200).json({
      success: true,
      count: data.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      availableGenres: allGenres.filter(Boolean).sort(),
      results: data
    });
  } catch (err) {
    console.error('[FandomController] getExploreContent error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch fandom content' });
  }
};

// GET /api/fandom/stats
exports.getFandomStats = async (req, res) => {
  try {
    await ensureSeedData();
    const categories = ['Anime', 'Gaming', 'Movies', 'TV Shows', 'K-Pop', 'Comics', 'Manga', 'Cosplay'];
    
    const stats = await Promise.all(
      categories.map(async (cat) => {
        const count = await FandomContent.countDocuments({ category: cat, isPublished: true });
        return { category: cat, count };
      })
    );

    res.status(200).json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
