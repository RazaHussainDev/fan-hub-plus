const Event = require('../models/Event');

// ─── Initial Seed Events ────────────────────────────────────────────────────────────
const SEED_EVENTS = [
  {
    title: 'San Diego Comic-Con International 2024',
    eventType: 'Convention',
    category: 'Comics',
    fandom: 'Marvel & DC Universe',
    city: 'San Diego',
    country: 'United States',
    venue: 'San Diego Convention Center',
    coordinates: { lat: 32.7072, lng: -117.1631 },
    dateString: 'October 18 - 21, 2024',
    startDate: new Date('2024-10-18'),
    time: '09:00 AM - 07:00 PM',
    description: 'The world\'s premier comic book, science fiction, and pop culture convention. Featuring Hall H studio panels, celebrity autograph signings, and massive exhibition floors.',
    bannerImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80',
    ticketUrl: 'https://comic-con.org',
    ticketPrice: '$75 - Day Badge',
    attendeesCount: 135000,
    isFeatured: true
  },
  {
    title: 'AnimeJapan Grand Expo Tokyo',
    eventType: 'Convention',
    category: 'Anime',
    fandom: 'Demon Slayer & JJK',
    city: 'Tokyo',
    country: 'Japan',
    venue: 'Tokyo Big Sight International Hall',
    coordinates: { lat: 35.6300, lng: 139.7972 },
    dateString: 'November 2 - 4, 2024',
    startDate: new Date('2024-11-02'),
    time: '10:00 AM - 06:00 PM',
    description: 'The epicenter of Japanese animation. Studio announcements from MAPPA, Ufotable, and Toei, exclusive merchandising booths, and official voice actor stages.',
    bannerImage: 'https://image.tmdb.org/t/p/original/9P4IIMYY3HifqeruZq0ZZ9g7YUi.jpg',
    ticketUrl: 'https://anime-japan.jp',
    ticketPrice: '¥2,300 (General Admission)',
    attendeesCount: 112000,
    isFeatured: true
  },
  {
    title: 'Gamescom Global Championship & Lan Arena',
    eventType: 'Gaming Tournament',
    category: 'Gaming',
    fandom: 'Cyberpunk & Elden Ring',
    city: 'Cologne',
    country: 'Germany',
    venue: 'Koelnmesse Exhibition Center',
    coordinates: { lat: 50.9463, lng: 6.9839 },
    dateString: 'November 15 - 18, 2024',
    startDate: new Date('2024-11-15'),
    time: '09:00 AM - 08:00 PM',
    description: 'The world\'s largest gaming and interactive entertainment trade fair. Hands-on gameplay demos, esports championship finals, and indie developer showcases.',
    bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80',
    ticketUrl: 'https://gamescom.global',
    ticketPrice: '€39.00 - Standard Pass',
    attendeesCount: 94000,
    isFeatured: false
  },
  {
    title: 'Seoul K-Pop Global Fans Festival & Gala',
    eventType: 'Concert & Expo',
    category: 'K-Pop',
    fandom: 'BTS & BLACKPINK',
    city: 'Seoul',
    country: 'South Korea',
    venue: 'Gocheok Sky Dome',
    coordinates: { lat: 37.4982, lng: 126.8671 },
    dateString: 'December 6 - 8, 2024',
    startDate: new Date('2024-12-06'),
    time: '05:00 PM - 10:30 PM',
    description: 'Celebrating Korean Pop culture with international fan choreography battles, lightstick sync experiences, K-Beauty styling zones, and live headline stages.',
    bannerImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80',
    ticketUrl: 'https://visitseoul.net',
    ticketPrice: '₩65,000 (Concert Pass)',
    attendeesCount: 48000,
    isFeatured: true
  },
  {
    title: 'MCM London Comic Con & European Cosplay Masters',
    eventType: 'Cosplay Meetup',
    category: 'Cosplay',
    fandom: 'Cosplay Guild & Pop Culture',
    city: 'London',
    country: 'United Kingdom',
    venue: 'ExCeL London Convention Centre',
    coordinates: { lat: 51.5085, lng: 0.0298 },
    dateString: 'October 25 - 27, 2024',
    startDate: new Date('2024-10-25'),
    time: '10:00 AM - 07:00 PM',
    description: 'Europe\'s biggest pop culture celebration featuring the EuroCosplay Championship finals, prop-making workshops, photo zones, and gaming zones.',
    bannerImage: 'https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?w=1200&q=80',
    ticketUrl: 'https://mcmcomiccon.com',
    ticketPrice: '£28.50 - Day Ticket',
    attendeesCount: 88000,
    isFeatured: false
  },
  {
    title: 'Anime Expo (AX) Los Angeles',
    eventType: 'Convention',
    category: 'Anime',
    fandom: 'Solo Leveling & Shonen',
    city: 'Los Angeles',
    country: 'United States',
    venue: 'Los Angeles Convention Center',
    coordinates: { lat: 34.0407, lng: -118.2690 },
    dateString: 'December 12 - 15, 2024',
    startDate: new Date('2024-12-12'),
    time: '10:00 AM - 08:00 PM',
    description: 'North America\'s largest celebration of Japanese pop culture, fashion, anime premieres, artist alley creators, and late-night masquerade dances.',
    bannerImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&q=80',
    ticketUrl: 'https://anime-expo.org',
    ticketPrice: '$80 - Full 4-Day Badge',
    attendeesCount: 110000,
    isFeatured: false
  },
  {
    title: 'Dune Part Two 70mm IMAX Fan Screening & Q&A',
    eventType: 'Movie Screening',
    category: 'Movies',
    fandom: 'Dune Universe',
    city: 'New York',
    country: 'United States',
    venue: 'AMC Lincoln Square IMAX Theater',
    coordinates: { lat: 40.7749, lng: -73.9818 },
    dateString: 'November 22, 2024',
    startDate: new Date('2024-11-22'),
    time: '07:30 PM - 11:00 PM',
    description: 'Exclusive 70mm IMAX fan screening of Denis Villeneuve\'s sci-fi epic followed by a live cast retrospective and commemorative Fremen poster giveaways.',
    bannerImage: 'https://image.tmdb.org/t/p/original/eZ239CUp1d6OryZEBPnO2n87gMG.jpg',
    ticketUrl: 'https://amctheatres.com',
    ticketPrice: '$28.00 (IMAX Experience)',
    attendeesCount: 850,
    isFeatured: false
  },
  {
    title: 'Comic Con Pakistan & Fandom Gathering 2024',
    eventType: 'Cosplay Meetup',
    category: 'Cosplay',
    fandom: 'Anime, Gaming & Comics',
    city: 'Karachi',
    country: 'Pakistan',
    venue: 'Expo Centre Karachi (Hall 2 & 3)',
    coordinates: { lat: 24.8967, lng: 67.0784 },
    dateString: 'December 28 - 29, 2024',
    startDate: new Date('2024-12-28'),
    time: '11:00 AM - 09:00 PM',
    description: 'Pakistan\'s largest anime, gaming and cosplay convention. Featuring national cosplay runway championships, Tekken 8 tournament, and comic artist alley.',
    bannerImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80',
    ticketUrl: 'https://ticketwala.pk',
    ticketPrice: 'Rs. 1,200 - Day Pass',
    attendeesCount: 18500,
    isFeatured: true
  }
];

// Helper to seed events if empty
async function ensureEventSeedData() {
  try {
    const count = await Event.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding initial Fandom Events & Conventions catalog...');
      await Event.insertMany(SEED_EVENTS);
      console.log('✅ Seeded 8 international fandom events.');
    }
  } catch (err) {
    console.error('Events seed check warning:', err.message);
  }
}

// Haversine distance calculator in KM
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
}

// ─── Controller Methods ─────────────────────────────────────────────────────────────

// GET /api/events
exports.getEvents = async (req, res) => {
  try {
    await ensureEventSeedData();
    const { city, category, eventType, search, lat, lng } = req.query;
    const query = { isPublished: true };

    if (city && city !== 'All' && city !== 'all') {
      query.city = new RegExp(`^${city.trim()}$`, 'i');
    }

    if (category && category !== 'All' && category !== 'all') {
      query.category = new RegExp(`^${category.trim()}$`, 'i');
    }

    if (eventType && eventType !== 'All' && eventType !== 'all') {
      query.eventType = eventType;
    }

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { title: { $regex: s, $options: 'i' } },
        { city: { $regex: s, $options: 'i' } },
        { venue: { $regex: s, $options: 'i' } },
        { fandom: { $regex: s, $options: 'i' } },
        { description: { $regex: s, $options: 'i' } }
      ];
    }

    let events = await Event.find(query).sort({ isFeatured: -1, startDate: 1 });

    // If user provided GPS coordinates, compute proximity distance
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      events = events.map(e => {
        const dist = calculateDistance(userLat, userLng, e.coordinates.lat, e.coordinates.lng);
        return { ...e.toObject(), distanceKm: dist };
      });

      // Sort by proximity
      events.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    // Extract available cities list
    const cities = await Event.distinct('city', { isPublished: true });

    res.status(200).json({
      success: true,
      count: events.length,
      availableCities: cities.sort(),
      results: events
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
};

// GET /api/events/:id
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.status(200).json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/events/:id/attend
exports.attendEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $inc: { attendeesCount: 1 } },
      { new: true }
    );
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.status(200).json({ success: true, attendeesCount: event.attendeesCount });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
