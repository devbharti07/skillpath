const requestBuckets = new Map();

export const rateLimiter = (options = { windowMs: 60000, maxRequests: 60 }) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const now = Date.now();

    let bucket = requestBuckets.get(ip);
    if (!bucket || now - bucket.startTime > options.windowMs) {
      bucket = { startTime: now, count: 0 };
      requestBuckets.set(ip, bucket);
    }

    bucket.count++;

    if (bucket.count > options.maxRequests) {
      return res.status(429).json({
        error: 'Too many requests. Please slow down and try again shortly.'
      });
    }

    next();
  };
};
