//  postgres: Next.js server action for POST /api/auth/login using Drizzle ORM
'use server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { signJwt, signRefreshToken } from '@/lib/jwt'; // You need to implement JWT helpers
import bcrypt from 'bcryptjs';

export async function loginAction({ email, password, remember_me, mfa_code }: {
  email: string;
  password: string;
  remember_me?: boolean;
  mfa_code?: string;
}) {
  // Find user by email
  const user = await db.select().from(users).where(eq(users.email, email)).then(res => res[0]);
  if (!user) {
    return { success: false, message: 'Invalid credentials' };
  }
  // Check password (replace with real hash check)
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { success: false, message: 'Invalid credentials' };
  }
  // TODO: Add MFA check if enabled
  // Generate tokens
  const access_token = signJwt({ userId: user.id });
  const refresh_token = signRefreshToken({ userId: user.id });
  return {
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        display_name: user.displayName,
        // role: user.role,  
        permissions: [], // TODO: fetch permissions
        avatar_url: user.avatarUrl,
      },
      access_token,
      refresh_token,
      expires_in: 3600,
    },
    message: 'Login successful',
  };
} 