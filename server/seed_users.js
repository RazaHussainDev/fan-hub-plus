require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

async function seedJuryUsers() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const usersToSeed = [
    {
      name: 'Super Administrator',
      email: 'superadmin@fanhubplus.com',
      password: 'SuperPass123!',
      role: 'superadmin',
      favorite_fandoms: ['Anime', 'Gaming', 'Movies', 'TV Shows'],
    },
    {
      name: 'System Admin',
      email: 'admin@fanhubplus.com',
      password: 'AdminPass123!',
      role: 'admin',
      favorite_fandoms: ['Anime', 'Gaming'],
    },
    {
      name: 'VIP Fan Explorer',
      email: 'fan@fanhubplus.com',
      password: 'FanPass123!',
      role: 'user',
      favorite_fandoms: ['Anime', 'K-Pop', 'Movies'],
    },
    {
      name: 'Lead Admin',
      email: 'admin@fanhub.com',
      password: 'SuperPass123!',
      role: 'superadmin',
      favorite_fandoms: ['Anime', 'Gaming', 'Movies'],
    }
  ];

  for (const u of usersToSeed) {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(u.password, salt);
    const updated = await User.findOneAndUpdate(
      { email: u.email },
      {
        $set: {
          name: u.name,
          email: u.email,
          password: hashedPassword,
          role: u.role,
          favorite_fandoms: u.favorite_fandoms,
          isBanned: false,
          token_version: 0
        }
      },
      { upsert: true, returnDocument: 'after' }
    );
    console.log('✅ Seeded user:', updated.email, 'Role:', updated.role);
  }

  console.log('🎉 ALL JURY TEST ACCOUNTS VERIFIED IN MONGODB!');
  process.exit(0);
}

seedJuryUsers().catch(e => {
  console.error('Seeding error:', e);
  process.exit(1);
});
