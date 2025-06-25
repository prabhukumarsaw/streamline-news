import { Metadata } from 'next';
import { Suspense } from 'react';
import { generateMetadata } from '@/lib/metadata';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Hero } from '@/components/home/hero';
import { Sidebar } from '@/components/layout/sidebar';
// Enhanced Home Page Components
import { BreakingNewsBanner } from '@/components/home/breaking-news-banner';
import { FeaturedHeroSection } from '@/components/home/featured-hero-section';
import { CategoryNewsSection } from '@/components/home/category-news-section';
import { TrendingSidebar } from '@/components/home/trending-sidebar';
import { NewsFlash } from '@/components/news/news-flash';
import { HotWords } from '@/components/news/hot-words';

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
      <Suspense fallback={<div className="h-12 bg-gray-200 animate-pulse" />}>
        <BreakingNewsBanner />
      </Suspense>
      <HotWords />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 py-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            <Suspense fallback={<LoadingSpinner />}>
              <Hero />
            </Suspense>

            {/* Category News Sections */}
            <Suspense fallback={<LoadingSpinner />}>
              <CategoryNewsSection
                title="Politics"
                showTabs={false}
                categoryId={4}
              />
            </Suspense>

            <Suspense fallback={<LoadingSpinner />}>
              <CategoryNewsSection
                title="Business"
                showTabs={false}
                categoryId={5}
              />
            </Suspense>

            <Suspense fallback={<LoadingSpinner />}>
              <CategoryNewsSection
                title="Technology"
                showTabs={false}
                categoryId={7}
              />
            </Suspense>

            {/* Tabbed Category Section */}
            <Suspense fallback={<LoadingSpinner />}>
              <CategoryNewsSection
                title="Explore by Category"
                showTabs={true}
              />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Suspense fallback={<LoadingSpinner />}>
              {/* <TrendingSidebar /> */}
              <Sidebar />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
