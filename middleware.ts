import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { hasPermission } from "./server/auth/permissions";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Public routes that don't require authentication
    const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password', '/auth/verify-email'];
    if (publicRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.next();
    }

    // Admin routes
    if (pathname.startsWith('/admin')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
      }

      const userPermissions = token.permissions as any;
      const requiredPermissions = ['system.config', 'user.view', 'role.assign'];
      
      if (!hasPermission(userPermissions, 'system.config')) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    // Dashboard routes
    if (pathname.startsWith('/dashboard')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
      }
    }

    // API routes protection
    if (pathname.startsWith('/api/admin')) {
      if (!token) {
        return new NextResponse(
          JSON.stringify({ success: false, message: 'authentication required' }),
          { status: 401, headers: { 'content-type': 'application/json' } }
        );
      }

      const userPermissions = token.permissions as any;
      if (!hasPermission(userPermissions, 'system.config')) {
        return new NextResponse(
          JSON.stringify({ success: false, message: 'insufficient permissions' }),
          { status: 403, headers: { 'content-type': 'application/json' } }
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow public routes
        const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password', '/auth/verify-email', '/'];
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true;
        }

        // Require authentication for protected routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/auth/logout',
    '/auth/:path*'
  ],
};