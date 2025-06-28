import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="mb-6">
          <FileX className="h-16 w-16 mx-auto text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Article Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The article you're looking for doesn't exist or has been removed.
        </p>
        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/news">
            <Button variant="outline" className="w-full">
              Browse All News
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 