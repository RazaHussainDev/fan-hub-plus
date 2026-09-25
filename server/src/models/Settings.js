const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Fan Hub Plus' },
  tagline: { type: String, default: 'Your Ultimate Fandom Universe' },
  maintenanceMode: { type: Boolean, default: false },
  announcement: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
