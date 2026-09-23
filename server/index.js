require('dotenv').config();

const express = require('express');
const cors    = require('cors');

const app  = express();
const PORT = process.env.PORT || 5000;

// â”€â”€â”€ Middleware â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// CORS â€” architecture_rules.md Â§3: allow only the Next.js frontend origin.
// In development that is http://localhost:3000.
// CLIENT_ORIGIN env var drives this in production (e.g. https://fanhubplus.vercel.app).
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // required for HttpOnly cookie exchange (JWT refresh flow)
  })
);

app.use(express.json());

// â”€â”€â”€ Unified Response Helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// technical_standards.md Â§4.3: every response MUST follow { success, data, message }
const sendSuccess = (res, data, message, statusCode = 200) =>
  res.status(statusCode).json({ success: true, data, message });

const sendError = (res, message, statusCode = 500) =>
  res.status(statusCode).json({ success: false, data: null, message });

// â”€â”€â”€ Routes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// Health-check / connection proof route
// Returns the canonical envelope so the frontend can verify the full HTTP handshake.
app.get('/api/status', (req, res) => {
  sendSuccess(res, null, 'Backend is fully connected to Fan Hub Plus!');
});

// 404 catch-all â€” any unmatched route
app.use((req, res) => {
  sendError(res, `Route ${req.method} ${req.originalUrl} not found.`, 404);
});

// â”€â”€â”€ Global Error Handler â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// technical_standards.md Â§4.3: errors must never return HTML â€” always JSON envelope.
// eslint-disable-next-line no-unused-vars
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

// â”€â”€â”€ Start Server â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
app.listen(PORT, () => {
  console.log(`âœ…  Fan Hub Plus â€” Express server running on http://localhost:${PORT}`);
  console.log(`    CORS allowed origin: ${process.env.CLIENT_ORIGIN || 'http://localhost:3000'}`);
});
