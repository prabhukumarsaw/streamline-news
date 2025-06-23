/**
 * Login Page
 * Created by: Prabhu
 * Description: Authentication page with login form and redirect handling
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: 'Sign In | Advanced News Platform',
  description: 'Sign in to your account to access the news platform dashboard.',
  robots: 'noindex, nofollow',
});

/**
 * Login page component
 * Provides user authentication interface
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Suspense fallback={<LoadingSpinner />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}