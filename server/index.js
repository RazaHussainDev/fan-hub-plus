require('dotenv').config();

const express = require('express');
const cors    = require('cors');

// Import Database Connection
const connectDB = require('./src/config/db');

// Import Route Handlers
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const contentRoutes = require('./src/routes/contentRoutes');
const fandomRoutes = require('./src/routes/fandomRoutes');
const merchRoutes = require('./src/routes/merchRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const audioRoutes = require('./src/routes/audioRoutes');
const ratingRoutes = require('./src/routes/ratingRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes');

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
if (process.env.NODE_ENV === 'production' && !process.env.CLIENT_ORIGIN) {
  throw new Error('CLIENT_ORIGIN must be configured in production.');
}

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
    origin(origin, callback) {
      // Requests without an Origin header are typically server-to-server or local tooling.
      if (!origin) return callback(null, true);

      const allowedOrigins = new Set(
        [
          process.env.CLIENT_ORIGIN,
          ...(process.env.NODE_ENV === 'production'
            ? []
            : ['http://localhost:3000', 'http://127.0.0.1:3000']),
        ].filter(Boolean)
      );

      if (allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error('Origin is not allowed by CORS.'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400,
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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
app.use('/api/fandom', fandomRoutes);
app.use('/api/merchandise', merchRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/audio', audioRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/feedback', feedbackRoutes);

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
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅  Fan Hub Plus — Express server running on port ${PORT}`);
  console.log(`    CORS allowed origin: ${process.env.CLIENT_ORIGIN || 'http://localhost:3000'}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process in production, but keep alive in dev
});
