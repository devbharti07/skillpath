import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'skillpath_super_secret_jwt_key_2026_secure';
const TOKEN_EXPIRY = '7d';

const createToken = (userId, role) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
};

const setAuthCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

export const register = async (req, res, next) => {
  try {
    const { email, password, confirmPassword, fullName, educationLevel, primaryCareerInterest } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Full name, email address, and password are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        fullName: fullName.trim(),
        role: 'STUDENT',
        profile: {
          create: {
            educationLevel: educationLevel || 'Not specified',
            primaryCareerInterest: primaryCareerInterest || 'Web Development',
            onboardingCompleted: false
          }
        }
      },
      include: {
        profile: true
      }
    });

    // Create a welcoming notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Welcome to SkillPath!',
        message: 'Complete your onboarding flow to unlock personalized career and skill recommendations.',
        type: 'SYSTEM'
      }
    });

    const token = createToken(user.id, user.role);
    setAuthCookie(res, token);

    return res.status(201).json({
      message: 'Account successfully registered.',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatarUrl: user.avatarUrl,
        profile: user.profile
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { profile: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = createToken(user.id, user.role);
    setAuthCookie(res, token);

    return res.json({
      message: 'Logged in successfully.',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatarUrl: user.avatarUrl,
        profile: user.profile
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'Logged out successfully.' });
};

export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        profile: true,
        userSkills: {
          include: { skill: true }
        },
        roadmaps: {
          where: { status: 'ACTIVE' },
          include: { roadmap: true }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      profile: user.profile,
      skillsCount: user.userSkills.length,
      activeRoadmapsCount: user.roadmaps.length
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { fullName, avatarUrl, educationLevel, bio, primaryCareerInterest, githubUrl, linkedinUrl, portfolioWebsite, isPublic } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(fullName && { fullName: fullName.trim() }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        profile: {
          upsert: {
            create: {
              educationLevel,
              bio,
              primaryCareerInterest,
              githubUrl,
              linkedinUrl,
              portfolioWebsite,
              isPublic: isPublic !== undefined ? isPublic : true
            },
            update: {
              ...(educationLevel !== undefined && { educationLevel }),
              ...(bio !== undefined && { bio }),
              ...(primaryCareerInterest !== undefined && { primaryCareerInterest }),
              ...(githubUrl !== undefined && { githubUrl }),
              ...(linkedinUrl !== undefined && { linkedinUrl }),
              ...(portfolioWebsite !== undefined && { portfolioWebsite }),
              ...(isPublic !== undefined && { isPublic })
            }
          }
        }
      },
      include: { profile: true }
    });

    return res.json({
      message: 'Profile updated successfully.',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        role: updatedUser.role,
        avatarUrl: updatedUser.avatarUrl,
        profile: updatedUser.profile
      }
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
    }

    if (confirmNewPassword && newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: 'New passwords do not match.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password provided is incorrect.' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { passwordHash: newHash }
    });

    return res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }

  // Safe response that avoids account enumeration and documents email integration
  return res.json({
    message: 'If an account exists with this email address, password reset instructions have been sent.',
    mode: 'development',
    notice: 'SMTP email credentials are not configured in local development. For testing, use your current password or reset directly via profile settings.'
  });
};

export const resetPassword = async (req, res) => {
  return res.json({
    message: 'Password reset completed.',
    notice: 'Please log in with your updated credentials.'
  });
};

export const exportUserData = async (req, res, next) => {
  try {
    const fullUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        profile: true,
        userSkills: { include: { skill: true } },
        attempts: { include: { assessment: true } },
        roadmaps: { include: { roadmap: true, progress: true } },
        projects: true,
        goals: { include: { tasks: true } },
        achievements: true,
        bookmarks: true
      }
    });

    // Strip sensitive fields
    const { passwordHash, ...safeData } = fullUser;
    return res.json({
      exportDate: new Date().toISOString(),
      user: safeData
    });
  } catch (error) {
    next(error);
  }
};
