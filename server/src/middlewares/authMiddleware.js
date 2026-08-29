import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { isDbConnected } from '../config/db.js';
import { activeUserStore } from '../services/userStore.js';
import { decrypt } from '../utils/crypto.js';

export async function authMiddleware(req, res, next) {
  try {
    let token = null;

    // Check HTTP-Only Cookie or Authorization header
    if (req.cookies && req.cookies.mailpulse_session) {
      token = req.cookies.mailpulse_session;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      req.user = null;
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mailpulse_jwt_secret_dev_key');

      if (decoded.userId && decoded.userId.toString().startsWith('mock_')) {
        req.user = null;
        return next();
      }
      
      let user = activeUserStore.getUser(decoded.userId);
      if (!user && isDbConnected() && decoded.userId && !decoded.userId.toString().startsWith('mock_')) {
        user = await User.findById(decoded.userId);
      }

      if (!user && decoded.sessionSnapshot) {
        try {
          const restoredUser = JSON.parse(decrypt(decoded.sessionSnapshot));
          if (restoredUser?._id) {
            activeUserStore.setUser(restoredUser._id, restoredUser);
            user = restoredUser;
          }
        } catch (restoreError) {
          // Ignore malformed snapshots and continue as unauthenticated.
        }
      }

      req.user = user || null;
      next();
    } catch (err) {
      req.user = null;
      next();
    }
  } catch (error) {
    next(error);
  }
}
