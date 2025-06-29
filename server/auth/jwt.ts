import jwt from 'jsonwebtoken';
import { db } from '@/db';
import { refreshTokens, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  permissions: any;
}

export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(): string {
  return uuidv4();
}

export async function storeRefreshToken(userId: string, token: string): Promise<void> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

  await db.insert(refreshTokens).values({
    token,
    userId,
    expiresAt,
  });
}

export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
  try {
    const tokenRecord = await db.query.refreshTokens.findFirst({
      where: and(
        eq(refreshTokens.token, refreshToken),
        eq(refreshTokens.isRevoked, false)
      ),
      with: {
        user: {
          with: {
            userRoles: {
              with: {
                role: true,
              },
            },
          },
        },
      },
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      return null;
    }

    // Revoke old refresh token
    await db.update(refreshTokens)
      .set({ isRevoked: true })
      .where(eq(refreshTokens.token, refreshToken));

    // Generate new tokens
    const user = tokenRecord.user as any; // Type assertion for user
    const userRole = user.userRoles[0]?.role;

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: userRole?.name || 'public',
      permissions: userRole?.permissions || {},
    });

    const newRefreshToken = generateRefreshToken();
    await storeRefreshToken(user.id, newRefreshToken);

    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await db.update(refreshTokens)
    .set({ isRevoked: true })
    .where(eq(refreshTokens.token, token));
}