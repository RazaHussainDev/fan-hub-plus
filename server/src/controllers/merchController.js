const Merchandise = require('../models/Merchandise');

// ─── Initial Seed Merchandise ───────────────────────────────────────────────────────
const SEED_MERCH = [
  {
    name: 'Cyberpunk 2077: Yaiba Kusanagi CT-3X Diecast Scale Bike',
    category: 'Gaming',
    fandom: 'Cyberpunk 2077',
    description: 'Precision-engineered 1/6 scale replica of V\'s iconic high-speed motorcycle with functional LED dash, working suspension, and weathering paint finish.',
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80',
    tag: 'Limited Edition',
    isUpcoming: false,
    releaseDate: 'Available Now',
    estimatedPrice: '$249.99 MSRP',
    officialStoreUrl: 'https://gear.cdprojektred.com',
    views: 1840,
    likes: 312
  },
  {
    name: 'Elden Ring: Malenia, Blade of Miquella 1:4 Scale Statue',
    category: 'Gaming',
    fandom: 'Elden Ring',
    description: 'Breathtaking 18-inch polystone collector statue featuring Malenia poised with her prosthesis sword, intricate rot flower base, and interchangeable unmasked portrait.',
    imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80',
    tag: 'Collectible',
    isUpcoming: false,
    releaseDate: 'Available Now',
    estimatedPrice: '$399.99 MSRP',
    officialStoreUrl: 'https://store.bandainamcoent.eu',
    views: 2950,
    likes: 489
  },
  {
    name: 'Jujutsu Kaisen: Satoru Gojo Shibuya Infinite Void Figure',
    category: 'Anime',
    fandom: 'Jujutsu Kaisen',
    description: 'Premium 1/7 scale figure capturing Gojo activating his domain expansion in the Shibuya metro. Translucent blue acrylic energy vortex base included.',
    imageUrl: 'https://image.tmdb.org/t/p/w780/hDzgFfnjA5t32n0rR13d5yqP1sN.jpg',
    tag: 'Pre-Order',
    isUpcoming: true,
    releaseDate: 'November 2024',
    estimatedPrice: '$189.99 MSRP',
    officialStoreUrl: 'https://goodsmile.info',
    views: 3410,
    likes: 620
  },
  {
    name: 'Demon Slayer: Tanjiro Hinokami Kagura Deluxe Figurine',
    category: 'Anime',
    fandom: 'Demon Slayer',
    description: 'Dynamic battle diorama with integrated LED fire dragon effects circling Tanjiro\'s black Nichirin blade during the Sun Breathing dance.',
    imageUrl: 'https://image.tmdb.org/t/p/w780/3GQKYh6Trm8pxd2AypovoYQf4Ay.jpg',
    tag: 'Collectible',
    isUpcoming: false,
    releaseDate: 'Available Now',
    estimatedPrice: '$165.00 MSRP',
    officialStoreUrl: 'https://aniplexplus.com',
    views: 2100,
    likes: 340
  },
  {
    name: 'Spider-Man Across the Spider-Verse: Miles Morales 1/6 Scale',
    category: 'Movies',
    fandom: 'Marvel Universe',
    description: 'Hot Toys masterpiece featuring newly tailored suit, interchangeable masked and unmasked head sculpts, web shooting accessories, and comic-style background card.',
    imageUrl: 'https://image.tmdb.org/t/p/w780/kVd3a9YeLGkoeR50jGEXM6EqseS.jpg',
    tag: 'Pre-Order',
    isUpcoming: true,
    releaseDate: 'December 2024',
    estimatedPrice: '$285.00 MSRP',
    officialStoreUrl: 'https://sideshow.com',
    views: 4120,
    likes: 710
  },
  {
    name: 'Dune Part Two: Crysknife of Paul Atreides Metal Prop Replica',
    category: 'Movies',
    fandom: 'Dune Universe',
    description: 'Official replica forged from high-density sculpted alloy with authentic Fremen carvings, etched leather sheath, and museum display stand.',
    imageUrl: 'https://image.tmdb.org/t/p/w780/eZ239CUp1d6OryZEBPnO2n87gMG.jpg',
    tag: 'Limited Edition',
    isUpcoming: false,
    releaseDate: 'Available Now',
    estimatedPrice: '$120.00 MSRP',
    officialStoreUrl: 'https://factoryent.com',
    views: 1980,
    likes: 275
  },
  {
    name: 'Arcane: Jinx Shark Rocket \'Fishbones\' Prop Blaster',
    category: 'TV Shows',
    fandom: 'League of Legends',
    description: 'Full-scale authentic replica of Jinx\'s signature heavy weapon with mechanical jaw actuation, authentic paint chipping, and LED chamber lighting.',
    imageUrl: 'https://image.tmdb.org/t/p/w780/5cvnxEHT3e39DvT6ARw4GNCFrB0.jpg',
    tag: 'Limited Edition',
    isUpcoming: true,
    releaseDate: 'Q4 2024',
    estimatedPrice: '$349.99 MSRP',
    officialStoreUrl: 'https://merch.riotgames.com',
    views: 3820,
    likes: 540
  },
  {
    name: 'BTS: Official Light Stick Special Edition (Map of the Soul)',
    category: 'K-Pop',
    fandom: 'BTS (ARMY)',
    description: 'Official Bluetooth-synchronized concert light stick with RGB multi-color modes, custom haptic feedback, and commemorative photocard set.',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    tag: 'Official Merch',
    isUpcoming: false,
    releaseDate: 'Available Now',
    estimatedPrice: '$59.99 MSRP',
    officialStoreUrl: 'https://weverseshop.io',
    views: 4500,
    likes: 890
  },
  {
    name: 'BLACKPINK: Born Pink World Tour Collector Vinyl LP Boxset',
    category: 'K-Pop',
    fandom: 'BLACKPINK (BLINK)',
    description: 'Deluxe pink-splatter double vinyl with 64-page hardcover tour photography photobook, holographic photocards, and collector badge.',
    imageUrl: 'https://image.tmdb.org/t/p/w780/vpo3qdjgasu2kxHIKkNIXK9hDHM.jpg',
    tag: 'Limited Edition',
    isUpcoming: false,
    releaseDate: 'Available Now',
    estimatedPrice: '$89.99 MSRP',
    officialStoreUrl: 'https://shop.blackpinkmusic.com',
    views: 2990,
    likes: 420
  },
  {
    name: 'Solo Leveling: Sung Jin-Woo Kasaka Blood Poison Dagger Set',
    category: 'Manga',
    fandom: 'Solo Leveling',
    description: 'Dual combat daggers forged from aerospace aluminum with electric purple luminescent veins, leather-wrapped handles, and wooden display plaque.',
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80',
    tag: 'Pre-Order',
    isUpcoming: true,
    releaseDate: 'January 2025',
    estimatedPrice: '$179.99 MSRP',
    officialStoreUrl: 'https://store.crunchyroll.com',
    views: 3100,
    likes: 615
  },
  {
    name: 'Batman: The Court of Owls Assassin Talon Mask Replica',
    category: 'Comics',
    fandom: 'DC Comics',
    description: 'Full-size wearable mask sculpted after Greg Capullo\'s iconic Court of Owls artwork. Features cold-cast porcelain finish and aged brass goggles.',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&q=80',
    tag: 'Collectible',
    isUpcoming: false,
    releaseDate: 'Available Now',
    estimatedPrice: '$99.99 MSRP',
    officialStoreUrl: 'https://shop.dccomics.com',
    views: 1650,
    likes: 240
  },
  {
    name: 'Cyberpunk: Night City LED Cyber-Optic Visor Prop',
    category: 'Cosplay',
    fandom: 'Cyberpunk Universe',
    description: 'Wearable cosplay eyewear featuring programmable scrolling cyber-glyphs, rechargeable USB-C battery, and ultra-comfortable silicone nose pads.',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
    tag: 'Exclusive',
    isUpcoming: true,
    releaseDate: 'Early 2025',
    estimatedPrice: '$110.00 MSRP',
    officialStoreUrl: 'https://etsy.com',
    views: 2450,
    likes: 380
  }
];

// Helper to seed merchandise if empty
async function ensureMerchSeedData() {
  try {
    const count = await Merchandise.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding initial Merchandise Showcase catalog...');
      await Merchandise.insertMany(SEED_MERCH);
      console.log('✅ Seeded 12 collector merchandise items.');
    }
  } catch (err) {
    console.error('Merch seed check warning:', err.message);
  }
}

// ─── Controller Methods ─────────────────────────────────────────────────────────────

// GET /api/merchandise
exports.getMerchandise = async (req, res) => {
  try {
    await ensureMerchSeedData();
    const { category, fandom, tag, upcoming, search, sort = 'popular' } = req.query;
    const query = { isPublished: true };

    if (category && category !== 'All' && category !== 'all') {
      query.category = new RegExp(`^${category.trim()}$`, 'i');
    }

    if (fandom && fandom !== 'All' && fandom !== 'all') {
      query.fandom = new RegExp(fandom.trim(), 'i');
    }

    if (tag && tag !== 'All' && tag !== 'all') {
      query.tag = tag;
    }

    if (upcoming === 'true') {
      query.isUpcoming = true;
    } else if (upcoming === 'false') {
      query.isUpcoming = false;
    }

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { name: { $regex: s, $options: 'i' } },
        { fandom: { $regex: s, $options: 'i' } },
        { description: { $regex: s, $options: 'i' } },
        { tag: { $regex: s, $options: 'i' } }
      ];
    }

    let sortOption = { popularity: -1, likes: -1, createdAt: -1 };
    if (sort === 'views') sortOption = { views: -1 };
    if (sort === 'likes') sortOption = { likes: -1 };
    if (sort === 'alpha') sortOption = { name: 1 };

    const items = await Merchandise.find(query).sort(sortOption);
    res.status(200).json({ success: true, count: items.length, results: items });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch merchandise' });
  }
};

// GET /api/merchandise/:id
exports.getMerchandiseById = async (req, res) => {
  try {
    const item = await Merchandise.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!item) return res.status(404).json({ success: false, message: 'Merchandise item not found' });
    res.status(200).json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PATCH /api/merchandise/:id/like
exports.likeMerchandise = async (req, res) => {
  try {
    const item = await Merchandise.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, likes: item.likes });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
