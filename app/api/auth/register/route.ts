import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { users, roles, userRoles } from '@/db/schema';
import { hashPassword, validatePassword } from '@/server/auth/password';
import { sendVerificationEmail } from '@/server/auth/email';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, username } = registerSchema.parse(body);

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json({
        success: false,
        message: 'Password does not meet requirements',
        errors: passwordValidation.errors,
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'User already exists with this email',
      }, { status: 409 });
    }

    // Check if username is taken
    const existingUsername = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (existingUsername) {
      return NextResponse.json({
        success: false,
        message: 'Username is already taken',
      }, { status: 409 });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Generate email verification token
    const emailVerificationToken = uuidv4();

    // Create user
    const newUser = await db.insert(users).values({
      email,
      username,
      passwordHash,
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      emailVerificationToken,
      status: 'pending',
    }).returning();

    // Assign default role (public/contributor)
    const defaultRole = await db.query.roles.findFirst({
      where: eq(roles.name, 'contributor'),
    });

    if (defaultRole) {
      await db.insert(userRoles).values({
        userId: newUser[0].id,
        roleId: defaultRole.id,
      });
    }

    // Send verification email
    try {
      await sendVerificationEmail(email, emailVerificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail registration if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'User registered successfully. Please check your email for verification.',
      data: {
        user: {
          id: newUser[0].id,
          email: newUser[0].email,
          username: newUser[0].username,
          firstName: newUser[0].firstName,
          lastName: newUser[0].lastName,
          status: newUser[0].status,
        },
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    
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