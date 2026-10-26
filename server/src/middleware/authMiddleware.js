import jwt from 'jsonwebtoken';
import { getPrisma } from '../config/prisma.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'filehub-jwt-secret-key-production-ready-2026';
export const AUTH_COOKIE_NAME = 'filehub_token';

/**
 * Returns standard cookie configuration for local development and production.
 */
export function getAuthCookieOptions(rememberMe = false) {
  const isProduction = process.env.NODE_ENV === 'production';
  const duration = rememberMe
    ? 30 * 24 * 60 * 60 * 1000 // 30 days
    : 7 * 24 * 60 * 60 * 1000;  // 7 days

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: duration,
    path: '/'
  };
}

/**
 * Authentication Middleware
 * Protects routes by verifying the HTTP-only JWT cookie or Authorization Bearer header.
 */
export async function authenticateUser(req, res, next) {
  try {
    // 1. Extract token from HTTP-only cookie or Authorization header
    let token = req.cookies?.[AUTH_COOKIE_NAME];

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to access this resource.'
      });
    }

    // 2. Verify token signature and expiration
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Your session has expired. Please log in again.'
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid session token. Please log in again.'
      });
    }

    // 3. Confirm user exists in the database
    const prisma = getPrisma();
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account no longer exists. Please register or log in again.'
      });
    }

    // 4. Attach authenticated user to request context
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server authentication error'
    });
  }
}
