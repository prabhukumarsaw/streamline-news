import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/server/auth/config';
import { db } from '@/db';
import { users } from '@/db/schema';
import { verifyMFA } from '@/server/auth/mfa';
import { eq } from 'drizzle-orm';

const verifyMFASchema = z.object({
  code: z.string().min(6, 'Code must be 6 digits').max(6, 'Code must be 6 digits'),
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
    const { code } = verifyMFASchema.parse(body);

    // Get user's MFA secret
    const user = await db.query.users.findFirst({
      where: eq(users.id, (session.user as any).id),
    });

    if (!user || !user.mfaSecret) {
      return NextResponse.json({
        success: false,
        message: 'MFA not set up',
      }, { status: 400 });
    }

    // Verify the code
    const isValid = verifyMFA(user.mfaSecret, code);

    if (!isValid) {
      return NextResponse.json({
        success: false,
        message: 'Invalid MFA code',
      }, { status: 400 });
    }

    // Enable MFA
    await db.update(users)
      .set({
        mfaEnabled: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({
      success: true,
      message: 'MFA enabled successfully',
    });

  } catch (error) {
    console.error('MFA verification error:', error);
    
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