import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { users } from '@/db/schema';
import { sendVerificationEmail } from '@/server/auth/email';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

const resendVerificationSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = resendVerificationSchema.parse(body);

    // Find user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // Always return success for security reasons
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a verification email has been sent.',
      });
    }

    // Check if user is already verified
    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: 'Email is already verified.',
      });
    }

    // Generate new verification token
    const newVerificationToken = uuidv4();

    // Update user with new token
    await db.update(users)
      .set({
        emailVerificationToken: newVerificationToken,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    // Send verification email
    try {
      await sendVerificationEmail(email, newVerificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      return NextResponse.json({
        success: false,
        message: 'Failed to send verification email. Please try again later.',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a verification email has been sent.',
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    
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