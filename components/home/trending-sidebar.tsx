/**
 * Trending Sidebar Component
 * Created by: Prabhu
 * Description: Sidebar with trending articles and widgets
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { TrendingUp, Clock, Eye, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useActiveNewsList } from '@/hooks/use-news-queries';
import { enhancedNewsService } from '@/services/enhanced-news-service';
import { formatRelativeTime } from '@/lib/utils';

export function TrendingSidebar() {
  const { data: trendingResponse } = useActiveNewsList({ 
    per_page: 10,
    sort_by: 'views',
    sort_order: 'desc'
  });

  const trendingArticles = trendingResponse?.data?.slice(0, 5).map((item: any) => 
    enhancedNewsService.transformArticle(item)
  ) || [];

  const popularArticles = trendingResponse?.data?.slice(5, 10).map((item: any) => 
    enhancedNewsService.transformArticle(item)
  ) || [];

  return (
    <div className="space-y-6">
      {/* Trending Articles */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-red-500" />
            Trending Now
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trendingArticles.map((article, index) => (
            <div key={article.id} className="flex gap-3">
              <div className="flex-shrink-0">
                <Badge variant="secondary" className="text-xs font-bold">
                  {index + 1}
                </Badge>
              </div>
              <div className="flex-1 space-y-2">
                <Link href={`/news/${article.slug}`}>
                  <h4 className="text-sm font-medium leading-tight hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                </Link>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatRelativeTime(article.publishedAt)}</span>
                  <span>•</span>
                  <Eye className="h-3 w-3" />
                  <span>{article.views.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator />

      {/* Popular Articles */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-500" />
            Most Read
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {popularArticles.map((article) => (
            <div key={article.id} className="flex gap-3">
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex-1 space-y-1">
                <Link href={`/news/${article.slug}`}>
                  <h4 className="text-sm font-medium leading-tight hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                </Link>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatRelativeTime(article.publishedAt)}</span>
                  <span>•</span>
                  <span>{article.readTime} min</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator />

      {/* Advertisement Space */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Advertisement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-sm">Ad Space</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Today's Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Articles Published</span>
            <span className="font-semibold">24</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Views</span>
            <span className="font-semibold">125K</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Comments</span>
            <span className="font-semibold">1.2K</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}