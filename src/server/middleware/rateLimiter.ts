import rateLimit from 'express-rate-limit';

/**
 * Rate limiting for AI analysis: maximum 20 analysis requests per 15 minutes per IP/User
 */
export const inspectionAnalyzeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // generous for testing while preventing runaway spam
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Rate limit exceeded: Please wait before submitting additional inspection analysis requests.',
  },
});
