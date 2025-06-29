'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Mail, Loader2, Check } from 'lucide-react';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const emailParam = searchParams.get('email');

  const [status, setStatus] = useState<
    'loading' | 'success' | 'error' | 'expired' | 'form' | 'registered'
  >('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState(emailParam || '');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else if (emailParam) {
      // User just registered, show success message
      setStatus('registered');
      setMessage(
        'Registration successful! Please check your email for a verification link.'
      );
    } else {
      setStatus('form');
    }
  }, [token, emailParam]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message);
      } else {
        if (data.message.includes('expired')) {
          setStatus('expired');
        } else {
          setStatus('error');
        }
        setMessage(data.message);
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred while verifying your email.');
    }
  };

  const resendVerification = async () => {
    if (!email) return;

    setIsResending(true);
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Verification email sent successfully!');
        setStatus('success');
      } else {
        setMessage(data.message);
        setStatus('error');
      }
    } catch (error) {
      setMessage('Failed to resend verification email.');
      setStatus('error');
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-lg">Verifying your email...</p>
          </div>
        );

      case 'registered':
        return (
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-600">
                Registration Successful!
              </h2>
              <p className="text-gray-600 mt-2">{message}</p>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-blue-900">
                      Check your email
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      We've sent a verification link to <strong>{email}</strong>
                    </p>
                    <p className="text-xs text-blue-600 mt-2">
                      Don't see the email? Check your spam folder or request a
                      new link below.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => resendVerification()}
                disabled={isResending}
              >
                {isResending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  'Resend Email'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/auth/login')}
              >
                Back to Login
              </Button>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-600">
                Email Verified!
              </h2>
              <p className="text-gray-600 mt-2">{message}</p>
            </div>
            <Button
              onClick={() => router.push('/auth/login')}
              className="w-full"
            >
              Continue to Login
            </Button>
          </div>
        );

      case 'error':
        return (
          <div className="flex flex-col items-center space-y-4">
            <XCircle className="h-12 w-12 text-red-600" />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600">
                Verification Failed
              </h2>
              <p className="text-gray-600 mt-2">{message}</p>
            </div>
            <Button
              onClick={() => setStatus('form')}
              variant="outline"
              className="w-full"
            >
              Try Again
            </Button>
          </div>
        );

      case 'expired':
        return (
          <div className="flex flex-col items-center space-y-4">
            <XCircle className="h-12 w-12 text-orange-600" />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-orange-600">
                Link Expired
              </h2>
              <p className="text-gray-600 mt-2">
                Your verification link has expired. Please request a new one.
              </p>
            </div>
            <Button onClick={() => setStatus('form')} className="w-full">
              Request New Link
            </Button>
          </div>
        );

      case 'form':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Verify Your Email</h2>
              <p className="text-gray-600 mt-2">
                Enter your email address to receive a new verification link.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button
              onClick={resendVerification}
              disabled={!email || isResending}
              className="w-full"
            >
              {isResending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                'Send Verification Email'
              )}
            </Button>

            <div className="text-center">
              <Link
                href="/auth/login"
                className="text-blue-600 hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">
              Email Verification
            </CardTitle>
            <CardDescription>
              Complete your account setup by verifying your email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderContent()}

            {message && status !== 'loading' && status !== 'registered' && (
              <Alert
                className={`mt-4 ${
                  status === 'success'
                    ? 'border-green-200 bg-green-50'
                    : status === 'error'
                      ? 'border-red-200 bg-red-50'
                      : 'border-orange-200 bg-orange-50'
                }`}
              >
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
