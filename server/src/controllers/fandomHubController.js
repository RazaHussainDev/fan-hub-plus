const Character = require('../models/Character');
const Article = require('../models/Article');

// ─── Initial Seed Characters ────────────────────────────────────────────────────────
const SEED_CHARACTERS = [
  {
    name: 'Satoru Gojo',
    fandom: 'Jujutsu Kaisen',
    category: 'Anime',
    role: 'Special Grade Sorcerer',
    bio: 'The pride of the Gojo clan and widely recognized as the strongest jujutsu sorcerer in the world. He acts as teacher and guardian to Yuji Itadori and Megumi Fushiguro.',
    quote: 'Throughout Heaven and Earth, I alone am the honored one.',
    abilities: ['Limitless Technique', 'Six Eyes', 'Infinity', 'Hollow Purple', 'Unlimited Void'],
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80',
    actor: 'Yuichi Nakamura',
    firstAppearance: 'Jujutsu Kaisen Chapter 1',
    likesCount: 1420
  },
  {
    name: 'Johnny Silverhand',
    fandom: 'Cyberpunk 2077',
    category: 'Gaming',
    role: 'Rockerboy Legend & Anti-Hero',
    bio: 'The charismatic and volatile lead singer of Samurai who led an assault against the Arasaka Corporation in Night City in 2023.',
    quote: 'Wake the fuck up, Samurai. We have a city to burn.',
    abilities: ['Charismatic Leadership', 'Malorian Arms 3516', 'Combat Veteran', 'Cybernetic Left Arm'],
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    actor: 'Keanu Reeves',
    firstAppearance: 'Cyberpunk 2020 / Cyberpunk 2077',
    likesCount: 1280
  },
  {
    name: 'Malenia, Blade of Miquella',
    fandom: 'Elden Ring',
    category: 'Gaming',
    role: 'Demigod Boss & Swordmaster',
    bio: 'Daughter of Queen Marika and Radagon, born twin to Miquella. Afflicted with the Scarlet Rot from birth, she became the fiercest swordfighter in the Lands Between.',
    quote: 'I am Malenia, Blade of Miquella. And I have never known defeat.',
    abilities: ['Waterfowl Dance', 'Scarlet Aeonia', 'Prosthetic Katana Mastery', 'Goddess of Rot'],
    imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80',
    actor: 'Pip Torrens / Pippa Bennett-Warner',
    firstAppearance: 'Elden Ring',
    likesCount: 1650
  },
  {
    name: 'Miles Morales',
    fandom: 'Marvel Universe',
    category: 'Movies',
    role: 'Spider-Man',
    bio: 'A Brooklyn teenager bitten by a genetically altered spider who steps into the mantle of Spider-Man while protecting the delicate fabric of the multiverse.',
    quote: 'Everyone keeps telling me how my story is supposed to go. Nah. Imma do my own thing.',
    abilities: ['Wall Crawling', 'Spider-Sense', 'Venom Strike', 'Camouflage Invisibility'],
    imageUrl: 'https://image.tmdb.org/t/p/w780/kVd3a9YeLGkoeR50jGEXM6EqseS.jpg',
    actor: 'Shameik Moore',
    firstAppearance: 'Ultimate Comics: Fallout #4',
    likesCount: 1890
  },
  {
    name: 'Jinx (Powder)',
    fandom: 'League of Legends',
    category: 'TV Shows',
    role: 'Loose Cannon of Zaun',
    bio: 'A manic and impulsive Zaunite criminal who revels in wreaking havoc with an arsenal of custom-built explosives and heavy weapons.',
    quote: 'She is not my sister anymore. She is Jinx.',
    abilities: ['Fishbones Rocket Launcher', 'Pow-Pow Minigun', 'Flame Chompers', 'Super Mega Death Rocket'],
    imageUrl: 'https://image.tmdb.org/t/p/w780/5cvnxEHT3e39DvT6ARw4GNCFrB0.jpg',
    actor: 'Ella Purnell',
    firstAppearance: 'Arcane Season 1',
    likesCount: 2100
  },
  {
    name: 'Sung Jin-Woo',
    fandom: 'Solo Leveling',
    category: 'Manga',
    role: 'The Shadow Monarch',
    bio: 'Originally dubbed "The Weakest Hunter of All Mankind", Jin-Woo survives a double dungeon trial and unlocks the Player system, ultimately becoming the sovereign of the dead.',
    quote: 'Arise.',
    abilities: ['Shadow Extraction', 'Rulers Authority', 'Stealth', 'Domain of the Monarch', 'Dagger Mastery'],
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80',
    actor: 'Taito Ban',
    firstAppearance: 'Solo Leveling Chapter 1',
    likesCount: 2450
  },
  {
    name: 'Batman (Bruce Wayne)',
    fandom: 'DC Comics',
    category: 'Comics',
    role: 'The Dark Knight',
    bio: 'Billionaire philanthropist who witnessed the murder of his parents as a child, dedicating his life to fighting crime in Gotham City behind the cowl of the Bat.',
    quote: 'I am vengeance. I am the night. I am Batman.',
    abilities: ['Peak Human Conditioning', 'Master Detective', 'Martial Arts Prodigy', 'High-Tech Arsenal'],
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&q=80',
    actor: 'Kevin Conroy / Christian Bale',
    firstAppearance: 'Detective Comics #27',
    likesCount: 2300
  },
  {
    name: 'Eren Yeager',
    fandom: 'Attack on Titan',
    category: 'Anime',
    role: 'The Founding Titan',
    bio: 'A former Scout Regiment member who vows to wipe out the Titans after his mother is devoured, eventually uncovering the truth of the world and unleashing the apocalyptic Rumbling.',
    quote: 'If you win, you live. If you lose, you die. If you dont fight, you cant win.',
    abilities: ['Attack Titan', 'Founding Titan Command', 'War Hammer Hardening', 'Future Sight'],
    imageUrl: 'https://image.tmdb.org/t/p/w780/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg',
    actor: 'Yuki Kaji',
    firstAppearance: 'Attack on Titan Chapter 1',
    likesCount: 1980
  }
];

// ─── Initial Seed Articles ──────────────────────────────────────────────────────────
const SEED_ARTICLES = [
  {
    title: 'The Narrative Architecture of Dogtown: How Phantom Liberty Redefined Cyberpunk Storytelling',
    summary: 'An investigative exploration into how CD Projekt Red combined espionage noir with gritty cybernetic body horror in the expansion of the decade.',
    content: `When CD Projekt Red announced Phantom Liberty, expectations were guarded. Yet, within minutes of stepping past Dogtown's militarized gates, players realized this was not merely an add-on—it was a masterclass in spy-thriller pacing.

From Idris Elba's morally compromised Solomon Reed to the fragile psionic power of Songbird, every dialogue choice tests loyalty. Unlike traditional role-playing experiences where players can achieve a pristine golden ending, Phantom Liberty insists on consequence.

The visual fidelity of Night City paired with path tracing elevates the environment from a backdrop to an antagonistic living entity. For fandom enthusiasts of cyberpunk, it represents the absolute zenith of the genre.`,
    category: 'Gaming',
    fandom: 'Cyberpunk Universe',
    author: {
      name: 'Alex Vance',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
      role: 'Staff Editor & Lore Analyst'
    },
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80',
    tags: ['Cyberpunk 2077', 'Phantom Liberty', 'Dogtown', 'Game Design', 'Lore Analysis'],
    readTime: '6 min read',
    status: 'approved',
    views: 4520,
    likes: 382,
    isFeatured: true
  },
  {
    title: 'The Cataclysm of Shibuya: Why Jujutsu Kaisen Season 2 Stunned the Global Anime Community',
    summary: 'A comprehensive retrospective on MAPPA\'s relentless animation and Gege Akutami\'s willingness to shatter status quo conventions.',
    content: `The Shibuya Incident arc is not just another seasonal climax; it is an unforgiving demolition of the safety nets modern shonen anime often rely on. 

Over 18 breathless episodes, viewers witnessed the imprisonment of Satoru Gojo—the invincible linchpin of the Jujutsu world—triggering a chain reaction of devastating losses. With Sukuna unleashing the Malevolent Shrine across Shibuya, MAPPA delivered kinetic cinematography that redefined television animation.

The lasting impact of Shibuya lies in its refusal to comfort the audience. Every consequence is permanent, leaving the fandom captivated and forever changed.`,
    category: 'Anime',
    fandom: 'Jujutsu Kaisen',
    author: {
      name: 'Rin Takahashi',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80',
      role: 'Anime Journalist'
    },
    coverImage: 'https://image.tmdb.org/t/p/original/9P4IIMYY3HifqeruZq0ZZ9g7YUi.jpg',
    tags: ['Jujutsu Kaisen', 'MAPPA', 'Gojo Satoru', 'Shibuya Arc', 'Shonen'],
    readTime: '5 min read',
    status: 'approved',
    views: 6180,
    likes: 540,
    isFeatured: true
  },
  {
    title: 'From Paper to Screen: The Explosive Rise of Solo Leveling and Korean Webtoons',
    summary: 'How Sung Jin-Woo\'s journey from E-Rank hunter to Shadow Monarch established a new benchmark for manhwa adaptations.',
    content: `For years, Japanese manga held undisputed dominance over comic adaptations. Then arrived Chugong and the late DUBU (Redice Studio) with Solo Leveling.

Its electric blue mana aesthetics, crisp progression systems, and unforgettable summoning catchphrase "Arise" captivated millions. The transition to A-1 Pictures' animated series proved that international fandoms are more than ready to embrace Korean storytelling.

Today, webtoons are shaping the future of global transmedia entertainment, with Solo Leveling proudly leading the vanguard.`,
    category: 'Manga',
    fandom: 'Solo Leveling',
    author: {
      name: 'Min-Jun Park',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      role: 'Manhwa Specialist'
    },
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&q=80',
    tags: ['Solo Leveling', 'Webtoon', 'Manhwa', 'Sung Jin-Woo', 'Shadow Monarch'],
    readTime: '4 min read',
    status: 'approved',
    views: 3890,
    likes: 295,
    isFeatured: false
  },
  {
    title: 'Mastering the Forge: Inside the Animatronic Wings and LED Armors of World Cosplay Summit',
    summary: 'A deep dive into high-tech materials, servo-driven wings, and foam fabrication pushing the boundaries of competitive costuming.',
    content: `Cosplay has transcended fabric and wigs. Today\'s elite convention stages in Tokyo, San Diego, and London showcase microcontrollers, pneumatic pistons, and automotive-grade paint finishes.

At the World Cosplay Summit, contestants spend over 1,000 hours per armor piece, engineering lightweight carbon-fiber substructures to support 8-foot wingspans. It is an art form merging sculpture, mechanical engineering, and live theatrical performance.`,
    category: 'Cosplay',
    fandom: 'Cosplay Guild',
    author: {
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
      role: 'Master Prop Fabricator'
    },
    coverImage: 'https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?w=1200&q=80',
    tags: ['Cosplay', 'Prop Making', 'Animatronics', 'Convention Life', 'EVA Foam'],
    readTime: '7 min read',
    status: 'approved',
    views: 2940,
    likes: 210,
    isFeatured: false
  }
];

// Helper to seed Characters and Articles if empty
async function ensureHubSeedData() {
  try {
    const charCount = await Character.countDocuments();
    if (charCount === 0) {
      console.log('🌱 Seeding initial Characters catalog...');
      await Character.insertMany(SEED_CHARACTERS);
      console.log('✅ Seeded 8 iconic Fandom Characters.');
    }

    const artCount = await Article.countDocuments();
    if (artCount === 0) {
      console.log('🌱 Seeding initial Featured Articles...');
      await Article.insertMany(SEED_ARTICLES);
      console.log('✅ Seeded 4 premium Featured Articles.');
    }
  } catch (err) {
    console.error('Hub seed check warning:', err.message);
  }
}

// ─── CHARACTER CONTROLLERS ──────────────────────────────────────────────────────────

// GET /api/characters
exports.getCharacters = async (req, res) => {
  try {
    await ensureHubSeedData();
    const { category, fandom, search } = req.query;
    const query = { isPublished: true };

    if (category && category !== 'all') {
      query.category = new RegExp(`^${category.trim()}$`, 'i');
    }

    if (fandom && fandom !== 'all') {
      query.fandom = new RegExp(fandom.trim(), 'i');
    }

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { name: { $regex: s, $options: 'i' } },
        { fandom: { $regex: s, $options: 'i' } },
        { bio: { $regex: s, $options: 'i' } }
      ];
    }

    const characters = await Character.find(query).sort({ likesCount: -1, createdAt: -1 });
    res.status(200).json({ success: true, count: characters.length, results: characters });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch characters' });
  }
};

// GET /api/characters/:id
exports.getCharacterById = async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    if (!character) return res.status(404).json({ success: false, message: 'Character not found' });
    res.status(200).json({ success: true, character });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PATCH /api/characters/:id/like
exports.likeCharacter = async (req, res) => {
  try {
    const character = await Character.findByIdAndUpdate(
      req.params.id,
      { $inc: { likesCount: 1 } },
      { new: true }
    );
    if (!character) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, likesCount: character.likesCount });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── ARTICLE CONTROLLERS ────────────────────────────────────────────────────────────

// GET /api/articles
exports.getArticles = async (req, res) => {
  try {
    await ensureHubSeedData();
    const { category, search, featured } = req.query;
    const query = { status: 'approved' };

    if (category && category !== 'all') {
      query.category = new RegExp(`^${category.trim()}$`, 'i');
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { title: { $regex: s, $options: 'i' } },
        { summary: { $regex: s, $options: 'i' } },
        { tags: { $in: [new RegExp(s, 'i')] } }
      ];
    }

    const articles = await Article.find(query).sort({ isFeatured: -1, createdAt: -1 });
    res.status(200).json({ success: true, count: articles.length, results: articles });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch articles' });
  }
};

// GET /api/articles/:id
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    res.status(200).json({ success: true, article });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/articles/submit (User Fan Content Submission)
exports.submitArticle = async (req, res) => {
  try {
    const { title, summary, content, category, fandom, coverImage, tags } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ success: false, message: 'Title, category, and content are required.' });
    }

    const newArticle = new Article({
      title,
      summary: summary || title.slice(0, 120),
      content,
      category,
      fandom: fandom || 'General',
      coverImage: coverImage || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      author: {
        id: req.user?._id || req.user?.id,
        name: req.user?.name || 'Community Fan',
        avatar: req.user?.avatar || '',
        role: req.user?.role === 'admin' ? 'Staff Contributor' : 'Community Fan'
      },
      // Admin submissions are approved instantly; regular users go to 'pending'
      status: req.user?.role === 'admin' ? 'approved' : 'pending'
    });

    await newArticle.save();

    res.status(201).json({
      success: true,
      message: req.user?.role === 'admin' 
        ? 'Article published successfully!' 
        : 'Thank you! Your fan article has been submitted for Admin moderation.',
      article: newArticle
    });
  } catch (err) {
    console.error('Submit article error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to submit article' });
  }
};

// ─── ADMIN MODERATION CONTROLLERS ───────────────────────────────────────────────────

// GET /api/admin/articles/pending
exports.getPendingSubmissions = async (req, res) => {
  try {
    const pendingArticles = await Article.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: pendingArticles.length, results: pendingArticles });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PATCH /api/admin/articles/:id/status
exports.moderateArticle = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });

    res.status(200).json({
      success: true,
      message: `Article ${status === 'approved' ? 'approved and published' : 'rejected'} successfully`,
      article
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
