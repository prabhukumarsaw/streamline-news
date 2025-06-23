'use client';

import { TrendingUp as Trending } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const trendingTopics = [
  { topic: 'AI Technology', count: 1234 },
  { topic: 'Climate Change', count: 987 },
  { topic: 'Space Exploration', count: 765 },
  { topic: 'Cryptocurrency', count: 654 },
  { topic: 'Health Research', count: 432 },
];

export function TrendingTopics() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Trending className="h-4 w-4" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {trendingTopics.map((item, index) => (
          <div key={item.topic} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                #{index + 1}
              </Badge>
              <span className="text-sm font-medium">{item.topic}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {item.count.toLocaleString()}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}