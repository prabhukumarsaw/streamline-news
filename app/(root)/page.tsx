import { Metadata } from 'next';
import { Suspense } from 'react';
import { generateMetadata } from '@/lib/metadata';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Sidebar } from '@/components/layout/sidebar';

// Enhanced Home Page Components
import { BreakingNewsBanner } from '@/components/home/breaking-news-banner';
import { EnhancedHeroSection } from '@/components/home/enhanced-hero-section';
import { CarouselNewsSection } from '@/components/home/carousel-news-section';
import { CategoryNewsSection } from '@/components/home/category-news-section';
import { TrendingSidebar } from '@/components/home/trending-sidebar';
import { NewsFlash } from '@/components/news/news-flash';
import { HotWords } from '@/components/news/hot-words';
import { getNews } from '@/server/news/getNews';
import { Article } from '@/types/news';

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

export default async function HomePage() {
  // Fetch from database with error handling
  let articles: Article[] = [];
  try {
    const raw = await getNews(15);
    articles = raw.map((a: any) => ({
      ...a,
      status: a.status ?? 'draft',
    })) as Article[];
  } catch (error) {
    console.error('Error in HomePage:', error);
    // Fallback to mock data if database fails
  }

  return (
    <>
      {/* Breaking News Banner */}
      <Suspense fallback={<div className="h-12 bg-gray-200 animate-pulse" />}>
        {/* <BreakingNewsBanner /> */}
      </Suspense>

      {/* Hot Words */}
      <HotWords />

      <div className="container mx-auto px-4">
        {/* Enhanced Hero Section */}
        <Suspense fallback={<LoadingSpinner />}>
          <EnhancedHeroSection articles={articles} />
        </Suspense>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 py-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Carousel News Sections */}
            <Suspense fallback={<LoadingSpinner />}>
              {/* <CarouselNewsSection title="Latest Politics" categoryId={4} /> */}
            </Suspense>

            <Suspense fallback={<LoadingSpinner />}>
              {/* <CarouselNewsSection title="Business & Economy" categoryId={5} /> */}
            </Suspense>

            <Suspense fallback={<LoadingSpinner />}>
              {/* <CarouselNewsSection
                title="Technology & Innovation"
                categoryId={7}
              /> */}
            </Suspense>

            {/* Category News Sections */}
            <Suspense fallback={<LoadingSpinner />}>
              {/* <CategoryNewsSection
                title="Sports"
                showTabs={false}
                categoryId={6}
              /> */}
            </Suspense>

            <Suspense fallback={<LoadingSpinner />}>
              {/* <CategoryNewsSection
                title="Entertainment"
                showTabs={false}
                categoryId={8}
              /> */}
            </Suspense>

            {/* Tabbed Category Section */}
            <Suspense fallback={<LoadingSpinner />}>
              {/* <CategoryNewsSection
                title="Explore by Category"
                showTabs={true}
              /> */}
            </Suspense>
          </div>

          {/* Enhanced Sidebar */}
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
