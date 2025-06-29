import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { users, userRoles, roles } from '@/db/schema';
import { eq } from 'drizzle-orm';

const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = verifyEmailSchema.parse(body);

    // Find user with verification token
    const user = await db.query.users.findFirst({
      where: eq(users.emailVerificationToken, token),
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired verification token',
      }, { status: 400 });
    }

    // Check if token is expired (24 hours)
    const tokenAge = Date.now() - new Date(user.createdAt || new Date()).getTime();
    const tokenExpiry = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (tokenAge > tokenExpiry) {
      return NextResponse.json({
        success: false,
        message: 'Verification token has expired',
      }, { status: 400 });
    }

    // Activate user account
    await db.update(users)
      .set({
        status: 'active',
        emailVerified: true,
        emailVerificationToken: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    // Assign default role if not already assigned
    const existingRole = await db.query.userRoles.findFirst({
      where: eq(userRoles.userId, user.id),
    });

    if (!existingRole) {
      const defaultRole = await db.query.roles.findFirst({
        where: eq(roles.name, 'contributor'),
      });

      if (defaultRole) {
        await db.insert(userRoles).values({
          userId: user.id,
          roleId: defaultRole.id,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully. You can now sign in.',
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          status: 'active',
        },
      },
    });

  } catch (error) {
    console.error('Email verification error:', error);
    
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