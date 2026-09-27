const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  eventType: {
    type: String,
    required: true,
    enum: ['Convention', 'Cosplay Meetup', 'Movie Screening', 'Gaming Tournament', 'Concert & Expo'],
    default: 'Convention',
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Anime', 'Gaming', 'Movies', 'TV Shows', 'K-Pop', 'Comics', 'Manga', 'Cosplay'],
    index: true
  },
  fandom: {
    type: String,
    default: 'Multiverse',
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  venue: {
    type: String,
    required: true,
    trim: true
  },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  dateString: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  time: {
    type: String,
    default: '10:00 AM - 08:00 PM'
  },
  description: {
    type: String,
    default: ''
  },
  bannerImage: {
    type: String,
    required: true
  },
  ticketUrl: {
    type: String,
    default: '#'
  },
  ticketPrice: {
    type: String,
    default: 'Free Registration'
  },
  attendeesCount: {
    type: Number,
    default: 120
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  isPublished: {
    type: Boolean,
    default: true,
    index: true
  }
}, { timestamps: true });

EventSchema.index({ title: 'text', city: 'text', venue: 'text', fandom: 'text', description: 'text' });

module.exports = mongoose.model('Event', EventSchema);
