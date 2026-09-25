require('dotenv').config();

const express = require('express');
const cors    = require('cors');

// Import Database Connection
const connectDB = require('./src/config/db');

// Import Route Handlers
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const contentRoutes = require('./src/routes/contentRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Add 15+ security headers
app.use(helmet());

// Content Security Policy (Optional but recommended: Allow iframe embeds from vidsrc)
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      frameSrc: ["'self'", "https://vidsrc.me", "https://multiembed.mov", "https://vidsrc.pro"],
      imgSrc: ["'self'", "data:", "https://image.tmdb.org", "https://images.unsplash.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  })
);

// Connect to MongoDB
connectDB();

const fs = require('fs');
const path = require('path');

// Ensure tmp_hls directory exists
const hlsDir = path.join(__dirname, 'tmp_hls');
if (!fs.existsSync(hlsDir)) {
  fs.mkdirSync(hlsDir);
}

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use('/hls', express.static(hlsDir));

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json());

// ─── Unified Response Helper ──────────────────────────────────────────────────
const sendSuccess = (res, data, message, statusCode = 200) =>
  res.status(statusCode).json({ success: true, data, message });

const sendError = (res, message, statusCode = 500) =>
  res.status(statusCode).json({ success: false, data: null, message });

// ─── Rate Limiting ───────────────────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 failed login/register attempts per hour
  message: { success: false, message: 'Too many login attempts, please try again after an hour.' }
});

// Apply general limiter to all /api routes
app.use('/api', apiLimiter);

// Apply strict limiter ONLY to auth routes (Login/Register)
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ─── Routes ──────────────────────────────────────────────────────────────────

app.get('/api/status', (req, res) => {
  sendSuccess(res, null, 'Backend is fully connected to Fan Hub Plus!');
});

// API Routes Wiring
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/content', contentRoutes);

// 404 catch-all
app.use((req, res) => {
  sendError(res, `Route ${req.method} ${req.originalUrl} not found.`, 404);
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Fan Hub Plus Error]', err.message);
  sendError(
    res,
    process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred. Please try again.'
      : err.message,
    err.statusCode || 500
  );
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Fan Hub Plus — Express server running on http://localhost:${PORT}`);
  console.log(`    CORS allowed origin: ${process.env.CLIENT_ORIGIN || 'http://localhost:3000'}`);
});
