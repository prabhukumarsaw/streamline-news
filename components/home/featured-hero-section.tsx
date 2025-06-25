/**
 * Featured Hero Section Component
 * Created by: Prabhu
 * Description: Main hero section with featured articles carousel
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Clock, User, Eye, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useActiveNewsList } from '@/hooks/use-news-queries';
import { enhancedNewsService } from '@/services/enhanced-news-service';
import { formatRelativeTime } from '@/lib/utils';

export function FeaturedHeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const { data: newsResponse, isLoading } = useActiveNewsList({ 
    per_page: 5,
    sort_by: 'created_at',
    sort_order: 'desc'
  });

  const featuredArticles = newsResponse?.data?.slice(0, 5).map((item: any) => 
    enhancedNewsService.transformArticle(item)
  ) || [];

  const sideArticles = newsResponse?.data?.slice(5, 9).map((item: any) => 
    enhancedNewsService.transformArticle(item)
  ) || [];

  useEffect(() => {
    if (!isAutoPlaying || featuredArticles.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredArticles.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredArticles.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredArticles.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8">
        <div className="lg:col-span-2">
          <div className="relative w-full h-[500px] bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (featuredArticles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No featured articles available</p>
      </div>
    );
  }

  return (
    <section className="py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Featured Carousel */}
        <div className="lg:col-span-2">
          <div className="relative w-full h-[500px] overflow-hidden rounded-lg group">
            {featuredArticles.map((article, index) => (
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
                          Featured
                        </Badge>
                        {article.trending && (
                          <Badge variant="secondary">Trending</Badge>
                        )}
                        <div className="flex items-center gap-1 text-sm opacity-90">
                          <Clock className="h-3 w-3" />
                          {formatRelativeTime(article.publishedAt)}
                        </div>
                      </div>
                      
                      <Link href={`/news/${article.slug}`}>
                        <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-4 hover:text-blue-300 transition-colors cursor-pointer line-clamp-2">
                          {article.title}
                        </h1>
                      </Link>
                      
                      <p className="text-lg opacity-90 mb-6 line-clamp-2 max-w-3xl">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 text-sm opacity-75">
                            <Eye className="h-3 w-3" />
                            {article.views.toLocaleString()} views
                          </div>
                          <div className="flex items-center gap-2 text-sm opacity-75">
                            <Clock className="h-3 w-3" />
                            {article.readTime} min read
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
              {featuredArticles.map((_, index) => (
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
          </div>
        </div>

        {/* Side Articles */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">
            Latest Updates
          </h2>
          
          {sideArticles.map((article) => (
            <Card key={article.id} className="overflow-hidden group hover:shadow-md transition-all duration-300">
              <div className="flex">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      News
                    </Badge>
                    {article.trending && (
                      <Badge className="text-xs bg-red-500">Live</Badge>
                    )}
                  </div>
                  <Link href={`/news/${article.slug}`}>
                    <h3 className="font-medium text-sm leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatRelativeTime(article.publishedAt)}</span>
                    <span>•</span>
                    <span>{article.views} views</span>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
          
          {/* View All Button */}
          <Link href="/latest">
            <Card className="p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <p className="text-primary font-medium">View All Latest News →</p>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
}