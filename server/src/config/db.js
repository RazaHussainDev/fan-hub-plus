const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ensureDefaultUsers = async () => {
  try {
    const User = require('../models/User');
    const defaultAccounts = [
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

    for (const acc of defaultAccounts) {
      const exists = await User.findOne({ email: acc.email });
      if (!exists) {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(acc.password, salt);
        await User.create({
          name: acc.name,
          email: acc.email,
          password: hashedPassword,
          role: acc.role,
          favorite_fandoms: acc.favorite_fandoms,
          isBanned: false,
          token_version: 0
        });
        console.log(`🛡️  Auto-seeded jury account: ${acc.email} (${acc.role})`);
      }
    }
  } catch (err) {
    console.warn(`⚠️  Default user ensure check warning: ${err.message}`);
  }
};

const connectDB = async () => {
  try {
    mongoose.set('bufferCommands', false); // Globally disable buffering
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4, 
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });
    console.log(`✅  MongoDB Connected: ${conn.connection.host}`);
    
    // Auto-verify default accounts
    ensureDefaultUsers();
  } catch (error) {
    console.error(`❌  MongoDB Connection Error: ${error.message}`);
  }
};

module.exports = connectDB;
