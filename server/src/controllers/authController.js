import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getPrisma } from '../config/prisma.js';
import {
  JWT_SECRET,
  AUTH_COOKIE_NAME,
  getAuthCookieOptions
} from '../middleware/authMiddleware.js';

// Regex for robust RFC-compliant email verification
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Creates 2-3 starter documents uniquely assigned to the newly created user
 * so their initial dashboard experience is populated without exposing shared documents.
 */
async function createStarterDocumentsForUser(prisma, userId, userName) {
  try {
    const starterDocs = [
      {
        name: `Welcome to FileHub - Quickstart Guide.pdf`,
        description: `Introductory guide for ${userName}: upload, categorize, search, and manage your private files with ease.`,
        category: 'Personal',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        userId
      },
      {
        name: 'Project Milestones & Deliverables.docx',
        description: 'Sample template for tracking goals, task deadlines, and project milestones.',
        category: 'Work',
        fileUrl: 'https://www.rfc-editor.org/rfc/rfc9110.pdf',
        userId
      }
    ];

    for (const doc of starterDocs) {
      await prisma.document.create({ data: doc });
    }
  } catch (err) {
    console.warn('⚠️ Could not seed starter documents for user:', err.message);
  }
}

/**
 * POST /api/auth/signup
 * Register a new user with secure password hashing.
 */
export async function signup(req, res, next) {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const errors = {};

    // 1. Validate full name
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    if (!trimmedName) {
      errors.name = 'Full name is required';
    } else if (trimmedName.length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    } else if (trimmedName.length > 70) {
      errors.name = 'Name cannot exceed 70 characters';
    }

    // 2. Validate email
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!normalizedEmail) {
      errors.email = 'Email address is required';
    } else if (!EMAIL_REGEX.test(normalizedEmail)) {
      errors.email = 'Please provide a valid email address';
    }

    // 3. Validate password
    if (!password || typeof password !== 'string') {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    // 4. Validate confirm password
    if (!confirmPassword) {
      errors.confirmPassword = 'Confirmation password is required';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please correct the errors.',
        errors
      });
    }

    const prisma = getPrisma();

    // 5. Check for duplicate email registration
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
        errors: { email: 'Email address is already registered' }
      });
    }

    // 6. Hash password securely using bcryptjs
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 7. Create user in MongoDB via Prisma
    const newUser = await prisma.user.create({
      data: {
        name: trimmedName,
        email: normalizedEmail,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    // 8. Seed initial private documents for this new user
    await createStarterDocumentsForUser(prisma, newUser.id, newUser.name);

    // 9. Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 10. Send HTTP-only cookie
    res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions(false));

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to FileHub.',
      user: newUser
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/login
 * Authenticate user credentials and return HTTP-only session cookie.
 */
export async function login(req, res, next) {
  try {
    const { email, password, rememberMe } = req.body;
    const errors = {};

    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!normalizedEmail) {
      errors.email = 'Email address is required';
    }

    if (!password || typeof password !== 'string') {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
        errors
      });
    }

    const prisma = getPrisma();

    // 1. Find user by email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user) {
      // Use generic error message to prevent account enumeration
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password'
      });
    }

    // 2. Verify hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password'
      });
    }

    // 3. Generate JWT token
    const tokenDuration = rememberMe ? '30d' : '7d';
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: tokenDuration }
    );

    // 4. Set HTTP-only cookie
    res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions(Boolean(rememberMe)));

    return res.status(200).json({
      success: true,
      message: 'Welcome back!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/logout
 * Clears the HTTP-only authentication cookie.
 */
export async function logout(req, res) {
  const isProduction = process.env.NODE_ENV === 'production';

  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/'
  });

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
}

/**
 * GET /api/auth/me
 * Retrieves current authenticated user session.
 */
export async function getMe(req, res) {
  return res.status(200).json({
    success: true,
    user: req.user
  });
}

/**
 * POST /api/auth/forgot-password
 * Handles password recovery requests transparently.
 */
export async function forgotPassword(req, res) {
  const { email } = req.body;
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }

  // Transparently inform user that email delivery service is not configured
  return res.status(200).json({
    success: false,
    configured: false,
    message: 'Password reset via email is currently in demo mode. SMTP email delivery service is not configured on this server. To reset your password, please contact the administrator or register a new account.'
  });
}
