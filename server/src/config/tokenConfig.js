const crypto = require('crypto');

const accessSecret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
if (!accessSecret) {
  throw new Error('JWT_ACCESS_SECRET (or legacy JWT_SECRET) must be configured.');
}

const refreshSecret = process.env.JWT_REFRESH_SECRET || (
  process.env.NODE_ENV === 'production' ? null : crypto.randomBytes(64).toString('hex')
);
if (!refreshSecret) {
  throw new Error('JWT_REFRESH_SECRET must be configured in production.');
}
if (process.env.NODE_ENV === 'production' && refreshSecret === accessSecret) {
  throw new Error('JWT_REFRESH_SECRET must be different from JWT_ACCESS_SECRET in production.');
}

const accessExpirySeconds = Number(process.env.JWT_ACCESS_EXPIRY || 900);
const refreshExpirySeconds = Number(process.env.JWT_REFRESH_EXPIRY || 604800);
if (!Number.isFinite(accessExpirySeconds) || accessExpirySeconds < 60) {
  throw new Error('JWT_ACCESS_EXPIRY must be a number of seconds (at least 60).');
}
if (!Number.isFinite(refreshExpirySeconds) || refreshExpirySeconds < 300) {
  throw new Error('JWT_REFRESH_EXPIRY must be a number of seconds (at least 300).');
}

module.exports = {
  accessSecret,
  refreshSecret,
  accessExpirySeconds,
  refreshExpirySeconds,
};
