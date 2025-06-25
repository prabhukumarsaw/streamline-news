import { Metadata } from 'next';
import { Suspense } from 'react';
import { Navbar } from '@/components/layout/navbar/navbar';
import { Footer } from '@/components/layout/footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: 'The Japan News - Breaking News & Latest Updates',
  description:
    'Stay informed with the latest breaking news, trending stories, and in-depth analysis from Japan and around the world.',
  keywords: [
    'Japan news',
    'breaking news',
    'latest news',
    'world news',
    'politics',
    'society',
  ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4">
        <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
      </main>

      <Footer />
    </div>
  );
}
