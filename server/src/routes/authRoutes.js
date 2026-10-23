import { Router } from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  exportUserData
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Public auth routes with rate limiting
router.post('/register', rateLimiter({ windowMs: 60000, maxRequests: 20 }), register);
router.post('/login', rateLimiter({ windowMs: 60000, maxRequests: 30 }), login);
router.post('/logout', logout);
router.post('/forgot-password', rateLimiter({ windowMs: 60000, maxRequests: 10 }), forgotPassword);
router.post('/reset-password', resetPassword);

// Protected profile routes
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);
router.get('/export-data', authenticate, exportUserData);

export default router;
