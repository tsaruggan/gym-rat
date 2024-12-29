import { rateLimit } from 'express-rate-limit'
import { checkUserExists } from '@/utils/firebase';

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // max 10 requests per windowMs
    message: { error: 'Too many requests, please try again later.' },
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
});

export default async function handler(req, res) {
  try {
    // Rate limit based on IP address
    // await limiter(req, res); 

    // Check if user exists;
    const { userId } = req.query;
    const exists = await checkUserExists(userId);
    res.status(200).json({ exists: exists });
  } catch {
    res.status(429).json({ error: 'Rate limit exceeded' });
  }
}
