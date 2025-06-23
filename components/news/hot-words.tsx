'use client';

import { Badge } from '@/components/ui/badge';
import { newsData } from '@/data/news-data';

export function HotWords() {
  const { hotWords } = newsData;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 overflow-x-auto">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
            Hot word
          </span>
          <div className="flex gap-2">
            {hotWords.map((word, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="whitespace-nowrap hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
              >
                {word}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}