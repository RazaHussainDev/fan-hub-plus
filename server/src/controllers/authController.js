const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const {
  accessSecret,
  refreshSecret,
  accessExpirySeconds,
  refreshExpirySeconds,
} = require('../config/tokenConfig');

const REFRESH_COOKIE = 'fanhub_refresh';
const SESSION_COOKIE = 'fanhub_session';
const cookieBaseOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
};

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const readCookie = (req, name) => {
  const prefix = `${name}=`;
  const entry = (req.headers.cookie || '').split(';').map(part => part.trim()).find(part => part.startsWith(prefix));
  return entry ? decodeURIComponent(entry.slice(prefix.length)) : null;
};

const clearSessionCookies = (res) => {
  res.clearCookie(REFRESH_COOKIE, { ...cookieBaseOptions, path: '/api/auth' });
  res.clearCookie(SESSION_COOKIE, { ...cookieBaseOptions, path: '/' });
};

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  watchlist: user.watchlist || [],
});

const issueSession = async (user, res) => {
  const identity = {
    id: String(user._id),
    userId: String(user._id),
    email: user.email,
    role: user.role,
    tokenVersion: user.token_version || 0,
  };
  const accessToken = jwt.sign(identity, accessSecret, { expiresIn: accessExpirySeconds });
  const refreshToken = jwt.sign(
    { id: String(user._id), tokenVersion: user.token_version || 0 },
    refreshSecret,
    { expiresIn: refreshExpirySeconds, jwtid: crypto.randomUUID() }
  );
  const sessionHint = jwt.sign(
    { userId: String(user._id), role: user.role, tokenType: 'session_hint' },
    accessSecret,
    { expiresIn: accessExpirySeconds, audience: 'fanhub-web' }
  );

  user.refresh_token = hashToken(refreshToken);
  await user.save({ validateBeforeSave: false });

  res.cookie(REFRESH_COOKIE, refreshToken, {
    ...cookieBaseOptions,
    path: '/api/auth',
    maxAge: refreshExpirySeconds * 1000,
  });
  res.cookie(SESSION_COOKIE, sessionHint, {
    ...cookieBaseOptions,
    path: '/',
    maxAge: accessExpirySeconds * 1000,
  });

  return accessToken;
};

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Password strength check: 8 chars, 1 uppercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long, contain 1 uppercase letter, 1 number, and 1 special character.',
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const accessToken = await issueSession(user, res);

    res.status(201).json({
      success: true,
      accessToken,
      user: publicUser(user),
    });
  } catch (err) {
    console.error('[Register Error]', err.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password +refresh_token');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.isBanned) {
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Contact support.' });
    }

    user.last_login = new Date();
    await user.save({ validateBeforeSave: false });

    const accessToken = await issueSession(user, res);

    res.status(200).json({
      success: true,
      accessToken,
      user: publicUser(user),
    });
  } catch (err) {
    console.error('[Login Error]', err.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// POST /api/auth/refresh
exports.refresh = async (req, res) => {
  const refreshToken = readCookie(req, REFRESH_COOKIE);
  if (!refreshToken) {
    clearSessionCookies(res);
    return res.status(401).json({ success: false, message: 'Session expired. Please sign in again.' });
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, refreshSecret);
  } catch (error) {
    clearSessionCookies(res);
    return res.status(401).json({ success: false, message: 'Session expired. Please sign in again.' });
  }

  try {
    const user = await User.findById(decoded.id).select('+refresh_token');
    if (!user) {
      clearSessionCookies(res);
      return res.status(401).json({ success: false, message: 'Session is no longer valid.' });
    }

    if (user.isBanned) {
      user.refresh_token = null;
      user.token_version = (user.token_version || 0) + 1;
      await user.save({ validateBeforeSave: false });
      clearSessionCookies(res);
      return res.status(401).json({ success: false, message: 'Session is no longer valid.' });
    }

    const tokenMatches = user.refresh_token && user.refresh_token === hashToken(refreshToken);
    const versionMatches = Number(decoded.tokenVersion || 0) === Number(user.token_version || 0);
    if (!tokenMatches || !versionMatches) {
      user.refresh_token = null;
      user.token_version = (user.token_version || 0) + 1;
      await user.save({ validateBeforeSave: false });
      clearSessionCookies(res);
      return res.status(401).json({ success: false, message: 'Session is no longer valid.' });
    }

    const accessToken = await issueSession(user, res);
    return res.status(200).json({ success: true, accessToken, user: publicUser(user) });
  } catch (error) {
    console.error('[Refresh Error]', error.message);
    return res.status(500).json({ success: false, message: 'Could not refresh the session. Please try again.' });
  }
};

// POST /api/auth/logout
exports.logout = async (req, res) => {
  const refreshToken = readCookie(req, REFRESH_COOKIE);
  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, refreshSecret);
      const user = await User.findById(decoded.id).select('+refresh_token');
      if (user && user.refresh_token === hashToken(refreshToken)) {
        user.refresh_token = null;
        user.token_version = (user.token_version || 0) + 1;
        await user.save({ validateBeforeSave: false });
      }
    } catch (error) {
      // Expired or invalid cookies are still cleared below.
    }
  }

  clearSessionCookies(res);
  return res.status(200).json({ success: true });
};

// POST /api/auth/watchlist
exports.toggleWatchlist = async (req, res) => {
  try {
    const { movieId, title, poster_path, media_type } = req.body;
    
    if (!movieId) {
      return res.status(400).json({ success: false, message: 'movieId is required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const watchlist = user.watchlist || [];
    const isSaved = watchlist.some(item => item.movieId === String(movieId));
    
    let updatedUser;
    if (isSaved) {
      updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { $pull: { watchlist: { movieId: String(movieId) } } },
        { new: true }
      );
    } else {
      updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { $push: { watchlist: { movieId: String(movieId), title, poster_path, media_type } } },
        { new: true }
      );
    }

    res.status(200).json({ success: true, watchlist: updatedUser.watchlist });
  } catch (error) {
    console.error('[Watchlist Error]', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/auth/watchlist
exports.getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('watchlist');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, watchlist: user.watchlist });
  } catch (error) {
    console.error('[Get Watchlist Error]', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
