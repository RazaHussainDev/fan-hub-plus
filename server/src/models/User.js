const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minLength: 3,
      maxLength: 30,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false,
    },
    refresh_token: {
      type: String,
      default: null,
      select: false,
    },
    token_version: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'superadmin'],
      default: 'user',
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: null,
    },
    favorite_fandoms: {
      type: [String],
      default: [],
    },
    last_login: {
      type: Date,
      default: null,
    },
    watchlist: [{
      movieId: { type: String, required: true },
      title: { type: String },
      poster_path: { type: String },
      media_type: { type: String },
      note: { type: String, default: '' }
    }],
    categories_of_interest: {
      type: [String],
      default: ['Anime', 'Gaming', 'Movies']
    },
    display_preferences: {
      streaming_server: { type: String, default: 'primary' },
      autoplay_trailers: { type: Boolean, default: true },
      preferred_theme: { type: String, default: 'dark' }
    }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
