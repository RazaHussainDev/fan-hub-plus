const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 30,
      match: /^[a-zA-Z0-9_ ]+$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password_hash: {
      type: String,
      required: true,
      select: false, // Never returned in queries by default
    },
    role: {
      type: String,
      enum: ['Visitor', 'Registered', 'Admin'],
      default: 'Registered',
    },
    favorite_fandoms: {
      type: [String],
      enum: ['Anime', 'Gaming', 'Movies', 'TV Shows', 'K-Pop', 'Comics', 'Manga', 'Cosplay'],
      default: [],
    },
    avatar_url: {
      type: String,
      default: null,
    },
    is_banned: {
      type: Boolean,
      default: false,
    },
    refresh_token: {
      type: String,
      default: null,
      select: false,
    },
    last_login: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

// Indexes
userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
