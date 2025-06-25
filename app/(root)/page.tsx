import { Metadata } from 'next';
import { Suspense } from 'react';
import { generateMetadata } from '@/lib/metadata';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Enhanced Home Page Components
import { BreakingNewsBanner } from '@/components/home/breaking-news-banner';
import { FeaturedHeroSection } from '@/components/home/featured-hero-section';
import { CategoryNewsSection } from '@/components/home/category-news-section';
import { TrendingSidebar } from '@/components/home/trending-sidebar';

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

export default function HomePage() {
  return (
    <>
      {/* Breaking News Banner */}
      <Suspense fallback={<div className="h-12 bg-gray-200 animate-pulse" />}>
        <BreakingNewsBanner />
      </Suspense>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 py-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Featured Hero Section */}
            <Suspense fallback={<LoadingSpinner />}>
              <FeaturedHeroSection />
            </Suspense>
            
            {/* Category News Sections */}
            <Suspense fallback={<LoadingSpinner />}>
              <CategoryNewsSection title="Politics" showTabs={false} defaultCategory="politics" />
            </Suspense>
            
            <Suspense fallback={<LoadingSpinner />}>
              <CategoryNewsSection title="Business" showTabs={false} defaultCategory="business" />
            </Suspense>
            
            <Suspense fallback={<LoadingSpinner />}>
              <CategoryNewsSection title="Technology" showTabs={false} defaultCategory="technology" />
            </Suspense>
            
            {/* Tabbed Category Section */}
            <Suspense fallback={<LoadingSpinner />}>
              <CategoryNewsSection title="Explore by Category" showTabs={true} />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Suspense fallback={<LoadingSpinner />}>
              <TrendingSidebar />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
