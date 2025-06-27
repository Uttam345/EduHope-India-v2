import rateLimit from 'express-rate-limit';

// General API rate limiting
export const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000)
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict rate limiting for newsletter subscription
export const newsletterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 subscription attempts per hour
  message: {
    success: false,
    message: 'Too many subscription attempts. Please try again in an hour.',
    retryAfter: 3600
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for successful requests
  skip: (req, res) => res.statusCode < 400,
});

// Very strict rate limiting for email sending
export const emailLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10, // limit each IP to 10 emails per day
  message: {
    success: false,
    message: 'Daily email limit exceeded. Please try again tomorrow.',
    retryAfter: 86400
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default {
  generalLimiter,
  newsletterLimiter,
  emailLimiter
};
