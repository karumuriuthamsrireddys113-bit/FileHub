import express from 'express';
import {
  signup,
  login,
  logout,
  getMe,
  forgotPassword
} from '../controllers/authController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);

// Protected session route
router.get('/me', authenticateUser, getMe);

export default router;
