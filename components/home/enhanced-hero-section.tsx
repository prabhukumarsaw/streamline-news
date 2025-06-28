/**
 * Enhanced Hero Section Component
 * Created by:  postgres
 * Description: Advanced hero layout with 3-section grid design
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Eye, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatRelativeTime } from '@/lib/utils';
import { Article } from '@/types/news';

export function EnhancedHeroSection({ articles }: { articles: Article[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const leftSectionArticles = articles.slice(0, 3);
  const centerCarouselArticles = articles.slice(3, 8);
  const rightSectionArticles = articles.slice(8, 11);

  useEffect(() => {
    if (!isAutoPlaying || centerCarouselArticles.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % centerCarouselArticles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, centerCarouselArticles.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + centerCarouselArticles.length) %
        centerCarouselArticles.length
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % centerCarouselArticles.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (!articles.length) {
    return <div>No news found.</div>;
  }
  console.log(articles);

  return (
    <section className="w-full py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
        {/* Left Section - 2 articles top, 1 bottom */}
        <div className="lg:col-span-3  space-y-4">
          {/* Top 2 articles */}
          <div className="space-y-4 h-[380px]">
            {leftSectionArticles
              .slice(0, 2)
              .map((article: Article, index: number) => (
                <Card
                  key={article.id}
                  className="overflow-hidden group hover:shadow-lg transition-all duration-300 h-[180px]"
                >
                  <div className="flex h-full">
                    <div className="relative h-24 w-24 sm:w-32 flex-shrink-0">
                      <Image
                        src={article.featuredImageId || '/placeholder.jpg'}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {article.isFeatured && (
                        <Badge className="absolute top-2 left-2 bg-red-500 text-xs">
                          Live
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        {/* <Badge variant="secondary" className="text-xs mb-2">
                        {article.categoryId}
                      </Badge> */}
                        <Link href={`/news/${article.slug}`}>
                          <h3 className="font-semibold text-sm leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-3">
                            {article.title}
                          </h3>
                        </Link>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatRelativeTime(article.publishedAt || '')}
                        </span>
                        <span>•</span>
                        <Eye className="h-3 w-3" />
                        <span>{article.viewCount}</span>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
          </div>

          {/* Bottom single article */}
          {leftSectionArticles[2] && (
            <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 h-[200px]">
              <div className="relative h-24">
                <Image
                  src={
                    leftSectionArticles[2].featuredImageId || '/placeholder.jpg'
                  }
                  alt={leftSectionArticles[2].title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {leftSectionArticles[2].isFeatured && (
                  <Badge className="absolute top-2 left-2 bg-red-500 text-xs">
                    Breaking
                  </Badge>
                )}
              </div>
              <CardContent className="p-3">
                <Badge variant="secondary" className="text-xs mb-2">
                  {leftSectionArticles[2].categoryId}
                </Badge>
                <Link href={`/news/${leftSectionArticles[2].slug}/love`}>
                  <h3 className="font-semibold text-sm leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {leftSectionArticles[2].title}
                  </h3>
                </Link>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {leftSectionArticles[2].excerpt}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    {formatRelativeTime(
                      leftSectionArticles[2].publishedAt || ''
                    )}
                  </span>
                  <span>•</span>
                  <span>{leftSectionArticles[2].readingTime} min read</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Center Section - Large Carousel */}
        <div className="lg:col-span-6 relative">
          <div className="relative w-full h-full overflow-hidden rounded-lg group">
            {centerCarouselArticles.map((article: Article, index: number) => (
              <div
                key={article.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === currentSlide
                    ? 'opacity-100 translate-x-0'
                    : index < currentSlide
                      ? 'opacity-0 -translate-x-full'
                      : 'opacity-0 translate-x-full'
                }`}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={article.featuredImageId || '/placeholder.jpg'}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="max-w-2xl">
                      <div className="flex items-center gap-3 mb-4">
                        <Badge className="bg-red-500 hover:bg-red-600">
                          {article.categoryId}
                        </Badge>
                        {article.isBreaking && (
                          <Badge variant="secondary">Breaking</Badge>
                        )}
                        <div className="flex items-center gap-1 text-sm opacity-90">
                          <Clock className="h-3 w-3" />
                          {formatRelativeTime(article.publishedAt || '')}
                        </div>
                      </div>

                      <Link href={`/news/${article.slug}`}>
                        <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-3 hover:text-blue-300 transition-colors cursor-pointer">
                          {article.title}
                        </h1>
                      </Link>

                      <p className="text-base opacity-90 mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm opacity-75">
                          <Eye className="h-3 w-3" />
                          <span>
                            {article.viewCount.toLocaleString()} views
                          </span>
                          <span>•</span>
                          <span>{article.readingTime} min read</span>
                        </div>

                        <Link href={`/news/${article.slug}`}>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                          >
                            Read More
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Arrows */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={goToNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {centerCarouselArticles.map((_, index: number) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? 'bg-white scale-110'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - 1 article top, 2 bottom */}
        <div className="lg:col-span-3 space-y-4">
          {/* Top single article */}
          {rightSectionArticles[0] && (
            <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 h-[200px]">
              <div className="relative h-24">
                <Image
                  src={
                    rightSectionArticles[0].featuredImageId ||
                    '/placeholder.jpg'
                  }
                  alt={rightSectionArticles[0].title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {rightSectionArticles[0].isFeatured && (
                  <Badge className="absolute top-2 left-2 bg-red-500 text-xs">
                    Hot
                  </Badge>
                )}
              </div>
              <CardContent className="p-3">
                <Badge variant="secondary" className="text-xs mb-2">
                  {rightSectionArticles[0].categoryId}
                </Badge>
                <Link href={`/news/${rightSectionArticles[0].slug}`}>
                  <h3 className="font-semibold text-sm leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {rightSectionArticles[0].title}
                  </h3>
                </Link>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {rightSectionArticles[0].excerpt}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    {formatRelativeTime(
                      rightSectionArticles[0].publishedAt || ''
                    )}
                  </span>
                  <span>•</span>
                  <span>{rightSectionArticles[0].readingTime} min read</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bottom 2 articles */}
          <div className="space-y-4 h-[380px]">
            {rightSectionArticles
              .slice(1, 3)
              .map((article: Article, index: number) => (
                <Card
                  key={article.id}
                  className="overflow-hidden group hover:shadow-lg transition-all duration-300 h-[180px]"
                >
                  <div className="flex h-full">
                    <div className="relative w-24 sm:w-32 flex-shrink-0">
                      <Image
                        src={article.featuredImageId || '/placeholder.jpg'}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {article.isBreaking && (
                        <Badge className="absolute top-2 left-2 bg-red-500 text-xs">
                          Trending
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <Badge variant="secondary" className="text-xs mb-2">
                          {article.categoryId}
                        </Badge>
                        <Link href={`/news/${article.slug}`}>
                          <h3 className="font-semibold text-sm leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-3">
                            {article.title}
                          </h3>
                        </Link>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatRelativeTime(article.publishedAt || '')}
                        </span>
                        <span>•</span>
                        <Eye className="h-3 w-3" />
                        <span>{article.viewCount}</span>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
