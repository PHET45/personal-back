//middleware/authMiddleware.js
import { getUserByToken } from "../service/authService.js";

export async function authenticate(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });

    const user = await getUserByToken(token);
    if (!user) return res.status(401).json({ error: 'Invalid token' });

    req.user = user; // มี user_metadata.name, user_metadata.username
    next();
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}
