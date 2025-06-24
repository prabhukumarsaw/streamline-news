'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Clock, User, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getTrendingNews } from '@/services/news-service';
import { formatRelativeTime } from '@/lib/utils';
import { newsData } from '@/data/news-data';

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const { data: trendingNews = [], isLoading } = useQuery({
    queryKey: ['trending-news-carousel'],
    queryFn: getTrendingNews,
  });

  // Fallback to mock data if API fails
  const slides = trendingNews.length > 0 ? trendingNews.slice(0, 5) : newsData.articles.slice(0, 5);

  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (isLoading) {
    return (
      <div className="relative w-full h-[500px] bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="relative w-full h-[500px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No featured articles available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-lg group">
      {/* Main Carousel */}
      <div className="relative w-full h-full">
        {slides.map((article, index) => {
          const author = newsData.authors.find(a => a.id === article.authorId);
          const category = newsData.categories.find(c => c.id === article.categoryId);

          return (
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
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="max-w-4xl">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className="bg-red-500 hover:bg-red-600">
                        {category?.name || 'News'}
                      </Badge>
                      {article.trending && (
                        <Badge variant="secondary">Breaking</Badge>
                      )}
                      <div className="flex items-center gap-1 text-sm opacity-90">
                        <Clock className="h-3 w-3" />
                        {formatRelativeTime(article.publishedAt)}
                      </div>
                    </div>
                    
                    <Link href={`/news/${article.slug}`}>
                      <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 hover:text-blue-300 transition-colors cursor-pointer">
                        {article.title}
                      </h1>
                    </Link>
                    
                    <p className="text-lg opacity-90 mb-6 line-clamp-2 max-w-3xl">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Image
                          src={author?.avatar || ''}
                          alt={author?.name || ''}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <p className="font-medium">{author?.name}</p>
                          <div className="flex items-center gap-2 text-sm opacity-75">
                            <Eye className="h-3 w-3" />
                            {article.views.toLocaleString()} views
                          </div>
                        </div>
                      </div>
                      
                      <Link href={`/news/${article.slug}`}>
                        <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                          Read More
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-white scale-110'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div
          className="h-full bg-white transition-all duration-300 ease-linear"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}