import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/server/auth/config';
import { db } from '@/db';
import { users } from '@/db/schema';
import { generateMFASecret, generateBackupCodes } from '@/server/auth/mfa';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({
        success: false,
        message: 'Authentication required',
      }, { status: 401 });
    }

    // Generate MFA secret and QR code
    const { secret, qrCode } = generateMFASecret(session.user.email!);
    const backupCodes = generateBackupCodes();

    // Store secret in database (not enabled yet)
    await db.update(users)
      .set({
        mfaSecret: secret,
        backupCodes: JSON.stringify(backupCodes),
      })
      .where(eq(users.id, (session.user as any).id));

    const qrCodeDataUrl = await qrCode;

    return NextResponse.json({
      success: true,
      data: {
        secret,
        qrCode: qrCodeDataUrl,
        backupCodes,
      },
    });

  } catch (error) {
    console.error('MFA setup error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}