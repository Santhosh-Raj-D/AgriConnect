import { cookies } from 'next/headers';
import { db } from './db';
import crypto from 'crypto';

const COOKIE_NAME = 'agri_session';
const SESSION_EXPIRY_DAYS = 7;

export function hashPassword(password: string): string {
  const salt = process.env.SESSION_SECRET || 'agriconnect-default-salt-value-2026';
  return crypto
    .createHash('sha256')
    .update(password + salt)
    .digest('hex');
}

export async function createSession(userId: string) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);

  const session = await db.session.create({
    data: {
      userId,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });

  return session;
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionId) return null;

  try {
    const session = await db.session.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            farmName: true,
            farmDetails: true,
            address: true,
            isBlocked: true,
          },
        },
      },
    });

    if (!session) return null;

    if (new Date() > session.expiresAt) {
      // Session expired, clean up
      await db.session.delete({ where: { id: sessionId } });
      cookieStore.delete(COOKIE_NAME);
      return null;
    }

    if (session.user.isBlocked) {
      // User is blocked, terminate session
      await db.session.delete({ where: { id: sessionId } });
      cookieStore.delete(COOKIE_NAME);
      return null;
    }

    return session.user;
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_NAME)?.value;
  if (sessionId) {
    try {
      await db.session.delete({ where: { id: sessionId } });
    } catch (error) {
      // Ignored if session already deleted
    }
    cookieStore.delete(COOKIE_NAME);
  }
}
