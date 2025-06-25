/**
 * Breaking News Banner Component
 * Created by: Prabhu
 * Description: Scrolling breaking news banner similar to Japan News
 */

'use client';

import { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { useActiveNewsList } from '@/hooks/use-news-queries';
import Link from 'next/link';

interface BreakingNewsItem {
  id: string;
  title: string;
  slug: string;
  urgent?: boolean;
}

export function BreakingNewsBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: newsResponse } = useActiveNewsList({
    per_page: 5,
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  const breakingNews: BreakingNewsItem[] =
    newsResponse?.slice(0, 3).map((item: any) => ({
      id: item.id,
      title: item.title || item.headline,
      slug: item.slug,
      urgent: item.is_urgent || false,
    })) || [];

  useEffect(() => {
    if (breakingNews.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % breakingNews.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [breakingNews.length]);

  return (
    <div className="bg-red-600 text-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-12">
          {/* Breaking News Label */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Badge className="bg-white text-red-600 font-bold px-3 py-1 text-sm">
              BREAKING NEWS
            </Badge>
          </div>

          {/* News Content */}
          <div className="flex-1 mx-4 overflow-hidden">
            <div className="relative h-6">
              {breakingNews.map((news, index) => (
                <div
                  key={news.id}
                  className={`absolute inset-0 flex items-center transition-all duration-500 ${
                    index === currentIndex
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-full'
                  }`}
                >
                  <Link
                    href={`/news/${news.slug}`}
                    className="text-sm font-medium hover:underline truncate"
                  >
                    {news.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="hidden sm:flex items-center space-x-1 mr-4">
            {breakingNews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-red-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" />
      </div>
    </div>
  );
}
