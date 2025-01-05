import { rateLimit } from 'express-rate-limit';
import { fetchUser } from '@/utils/firebase';

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // max 10 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  legacyHeaders: false,
  standardHeaders: true,
});

export default async function handler(req, res) {
  try {
    // Rate limit based on IP address
    // await limiter(req, res); 

    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId.' });
    }

    const user = await fetchUser(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ user });
  } catch (error) {
    if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }
    res.status(500).json({ error: error.message });
  }
}
