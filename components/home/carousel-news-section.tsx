/**
 * Carousel News Section Component
 * Created by:  postgres
 * Description: Horizontal scrolling news carousel with categories
 */

'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Clock, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useActiveNewsList } from '@/hooks/use-news-queries';
import { formatRelativeTime } from '@/lib/utils';

interface CarouselNewsSectionProps {
  title: string;
  categoryId?: number;
  showViewAll?: boolean;
}

export function CarouselNewsSection({
  title,
  categoryId,
  showViewAll = true,
}: CarouselNewsSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { data: newsResponse, isLoading } = useActiveNewsList({
    per_page: 12,
    category_id: categoryId,
    sort_by: 'publication_date',
    sort_order: 'desc',
  });

  const articles = newsResponse?.articles || [];

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;

    const scrollAmount = 320; // Width of one card plus gap
    const newScrollLeft =
      direction === 'left'
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;

    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });

    // Update scroll button states
    setTimeout(() => {
      if (scrollRef.current) {
        setCanScrollLeft(scrollRef.current.scrollLeft > 0);
        setCanScrollRight(
          scrollRef.current.scrollLeft <
            scrollRef.current.scrollWidth - scrollRef.current.clientWidth
        );
      }
    }, 300);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;

    setCanScrollLeft(scrollRef.current.scrollLeft > 0);
    setCanScrollRight(
      scrollRef.current.scrollLeft <
        scrollRef.current.scrollWidth - scrollRef.current.clientWidth
    );
  };

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-80 h-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse flex-shrink-0"
            />
          ))}
        </div>
      </section>
    );
  }

  if (articles.length === 0) return null;

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showViewAll && (
          <Link href={categoryId ? `/category/${categoryId}` : '/news'}>
            <Button variant="outline">View All</Button>
          </Link>
        )}
      </div>

      {/* Carousel */}
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {articles.map((article, index) => (
            <Card
              key={article.id}
              className="w-80 flex-shrink-0 overflow-hidden group hover:shadow-lg transition-all duration-300"
            >
              <div className="relative aspect-video">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {article.trending && (
                  <Badge className="absolute top-3 left-3 bg-red-500">
                    {index === 0 ? 'Breaking' : 'Trending'}
                  </Badge>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {article.categoryId}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatRelativeTime(article.publishedAt)}
                  </div>
                </div>

                <Link href={`/news/${article.slug}`}>
                  <h3 className="font-semibold leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                </Link>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{article.views.toLocaleString()}</span>
                  </div>
                  <span>{article.readTime} min read</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
