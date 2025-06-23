import { Metadata } from 'next';
import { Suspense } from 'react';
import { Hero } from '@/components/home/hero';
import { Sidebar } from '@/components/layout/sidebar';
import { NewsSections } from '@/components/home/news-sections';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { generateMetadata } from '@/lib/metadata';
import { NewsFlash } from '@/components/news/news-flash';
import { HotWords } from '@/components/news/hot-words';

export const metadata: Metadata = generateMetadata({
  title: 'The Japan News - Breaking News & Latest Updates',
  description: 'Stay informed with the latest breaking news, trending stories, and in-depth analysis from Japan and around the world.',
  keywords: ['Japan news', 'breaking news', 'latest news', 'world news', 'politics', 'society'],
});

export default function HomePage() {
  return (
    <>
      <NewsFlash />
      <HotWords />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 py-8">
         
         <div className="lg:col-span-3 space-y-12">
           <Suspense fallback={<LoadingSpinner />}>
             <Hero />
           </Suspense>
           
           <Suspense fallback={<LoadingSpinner />}>
             <NewsSections />
           </Suspense>
         </div>
         <div className="lg:col-span-1">
           <Suspense fallback={<LoadingSpinner />}>
             <Sidebar />
           </Suspense>
         </div>
        
       </div>
    </>
        
      
  );
}