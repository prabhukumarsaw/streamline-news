'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { WeatherWidget } from '@/components/widgets/weather-widget';
import { TimeWidget } from '@/components/widgets/time-widget';
import { VisitorCountWidget } from '@/components/widgets/visitor-count-widget';
import { TrendingTopics } from '@/components/widgets/trending-topics';
import { PopularArticles } from '@/components/widgets/popular-articles';
import { getTrendingNews } from '@/services/news-service';

export function Sidebar() {
  const { data: trendingNews = [] } = useQuery({
    queryKey: ['trending-news'],
    queryFn: getTrendingNews,
  });

  return (
    <div className="space-y-6">
      {/* Widgets */}
      <div className="grid grid-cols-1 gap-4">
        <WeatherWidget />
        <TimeWidget />
        <VisitorCountWidget />
      </div>

      <Separator />

      {/* Trending Topics */}
      <TrendingTopics />

      <Separator />

      {/* Popular Articles */}
      <PopularArticles articles={trendingNews} />

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
    </div>
  );
}