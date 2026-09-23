require('dotenv').config();

const express = require('express');
const cors    = require('cors');

// Import Route Handlers
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const contentRoutes = require('./src/routes/contentRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────

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
