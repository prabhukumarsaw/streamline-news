'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldOff } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow text-center">
        <ShieldOff className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-red-600 mb-2">Access Denied</h1>
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertDescription>
            You do not have permission to access this page.
            <br />
            Please contact your administrator if you believe this is a mistake.
          </AlertDescription>
        </Alert>
        <div className="flex flex-col gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/login">Back to Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
