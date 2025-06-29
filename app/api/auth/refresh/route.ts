import { NextRequest, NextResponse } from 'next/server';
import { refreshAccessToken } from '@/server/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json({
        success: false,
        message: 'No refresh token provided',
      }, { status: 401 });
    }

    const tokens = await refreshAccessToken(refreshToken);

    if (!tokens) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired refresh token',
      }, { status: 401 });
    }

    const response = NextResponse.json({
      success: true,
      data: {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        expires_in: 900, // 15 minutes
      },
    });

    // Set new HTTP-only cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    };

    response.cookies.set('access_token', tokens.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60, // 15 minutes
    });

    response.cookies.set('refresh_token', tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;

  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}