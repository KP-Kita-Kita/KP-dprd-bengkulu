// Rate limiter berbasis memori untuk anti-spam
const rateLimitStore = new Map();

// Bersihkan entry expired setiap 10 menit
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore) {
    if (now - data.firstRequest > data.windowMs) {
      rateLimitStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

/**
 * Membuat middleware rate limiter
 * @param {number} maxRequests - Jumlah maksimal request
 * @param {number} windowMs - Jendela waktu dalam milidetik
 */
const createRateLimit = (maxRequests = 2, windowMs = 5 * 60 * 1000) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const key = `${ip}:${req.originalUrl}`;
    const now = Date.now();

    const record = rateLimitStore.get(key);

    if (!record) {
      rateLimitStore.set(key, { count: 1, firstRequest: now, windowMs });
      return next();
    }

    // Apakah masih dalam jendela waktu?
    if (now - record.firstRequest > windowMs) {
      // Reset karena sudah melewati jendela waktu
      rateLimitStore.set(key, { count: 1, firstRequest: now, windowMs });
      return next();
    }

    // Masih dalam jendela waktu
    record.count++;

    if (record.count > maxRequests) {
      const retryAfterSec = Math.ceil((windowMs - (now - record.firstRequest)) / 1000);
      return res.status(429).json({
        message: `Terlalu banyak permintaan. Silakan coba lagi dalam ${Math.ceil(retryAfterSec / 60)} menit.`
      });
    }

    next();
  };
};

module.exports = { createRateLimit };
