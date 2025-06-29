import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { db } from '@/db';
import { users, userRoles, roles } from '@/db/schema';
import { verifyPassword } from '@/server/auth/password';
import { verifyMFA } from '@/server/auth/mfa';
import { generateAccessToken, generateRefreshToken, storeRefreshToken } from '@/server/auth/jwt';
import { eq } from 'drizzle-orm';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  remember_me: z.boolean().optional().default(false),
  mfa_code: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, remember_me, mfa_code } = loginSchema.parse(body);

    // Find user with roles
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
      with: {
        userRoles: {
          with: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Invalid credentials',
      }, { status: 401 });
    }

    // Check account status
    if (user.status !== 'active') {
      return NextResponse.json({
        success: false,
        message: 'Account is not active. Please verify your email or contact support.',
      }, { status: 401 });
    }

    // Check if account is locked
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      return NextResponse.json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts.',
      }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      // Increment login attempts
      await db.update(users)
        .set({
          loginAttempts: (user.loginAttempts || 0) + 1,
          lockedUntil: (user.loginAttempts || 0) >= 4 ? new Date(Date.now() + 15 * 60 * 1000) : null,
        })
        .where(eq(users.id, user.id));
      
      return NextResponse.json({
        success: false,
        message: 'Invalid credentials',
      }, { status: 401 });
    }

    // Check MFA if enabled
    if (user.mfaEnabled && !mfa_code) {
      return NextResponse.json({
        success: false,
        message: 'MFA code required',
        requiresMFA: true,
      }, { status: 200 });
    }

    if (user.mfaEnabled && mfa_code) {
      const isValidMFA = verifyMFA(user.mfaSecret!, mfa_code);
      if (!isValidMFA) {
        return NextResponse.json({
          success: false,
          message: 'Invalid MFA code',
        }, { status: 401 });
      }
    }

    // Reset login attempts on successful login
    await db.update(users)
      .set({
        loginAttempts: 0,
        lockedUntil: null,
        lastLogin: new Date(),
      })
      .where(eq(users.id, user.id));

    // Generate tokens
    const userRole = user.userRoles[0]?.role;
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: userRole?.name || 'public',
      permissions: userRole?.permissions || {},
    });

    const refreshToken = generateRefreshToken();
    await storeRefreshToken(user.id, refreshToken);

    // Set cookies
    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          display_name: user.displayName || `${user.firstName} ${user.lastName}`,
          role: userRole?.name || 'public',
          permissions: userRole?.permissions || {},
          avatar_url: user.avatarUrl,
        },
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: 900, // 15 minutes
      },
      message: 'Login successful',
    });

    // Set HTTP-only cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    };

    response.cookies.set('access_token', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60, // 15 minutes
    });

    response.cookies.set('refresh_token', refreshToken, {
      ...cookieOptions,
      maxAge: remember_me ? 30 * 24 * 60 * 60 : 24 * 60 * 60, // 30 days if remember me, otherwise 1 day
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}