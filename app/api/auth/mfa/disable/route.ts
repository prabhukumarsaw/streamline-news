import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/server/auth/config';
import { db } from '@/db';
import { users } from '@/db/schema';
import { verifyPassword } from '@/server/auth/password';
import { eq } from 'drizzle-orm';

const disableMFASchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({
        success: false,
        message: 'Authentication required',
      }, { status: 401 });
    }

    const body = await request.json();
    const { password } = disableMFASchema.parse(body);

    // Get user
    const user = await db.query.users.findFirst({
      where: eq(users.id, (session.user as any).id),
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found',
      }, { status: 404 });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        message: 'Invalid password',
      }, { status: 400 });
    }

    // Disable MFA
    await db.update(users)
      .set({
        mfaEnabled: false,
        mfaSecret: null,
        backupCodes: JSON.stringify([]),
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({
      success: true,
      message: 'MFA disabled successfully',
    });

  } catch (error) {
    console.error('MFA disable error:', error);
    
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