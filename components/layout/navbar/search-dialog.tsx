'use client';

import { useCallback, useEffect, useState, memo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Loader2,
  X,
  ChevronRight,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useDebounce } from '@/hooks/use-debounce';
import { searchNews } from '@/services/news-service';

// Mock recent searches - in real app, get from localStorage
const recentSearches = ['राजनीति', 'खेल समाचार', 'बॉलीवुड', 'तकनीक'];

const trendingSearches = [
  'चुनाव 2024',
  'मौसम अपडेट',
  'शेयर बाजार',
  'क्रिकेट स्कोर',
];

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog = memo(({ open, onOpenChange }: SearchDialogProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>(recentSearches);
  const debouncedQuery = useDebounce(searchQuery, 300);
  const router = useRouter();

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      setIsSearching(true);
      searchNews(debouncedQuery)
        .then(setSearchResults)
        .catch((error) => {
          console.error('Search error:', error);
          setSearchResults([]);
        })
        .finally(() => setIsSearching(false));
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [debouncedQuery]);

  const handleResultClick = useCallback(
    (href: string) => {
      onOpenChange(false);
      router.push(href);

      // Add to search history
      if (searchQuery.trim()) {
        setSearchHistory((prev) => {
          const newHistory = [
            searchQuery,
            ...prev.filter((item) => item !== searchQuery),
          ];
          return newHistory.slice(0, 5); // Keep only 5 recent searches
        });
      }
    },
    [onOpenChange, router, searchQuery]
  );

  const handleQuickSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery('');
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [open]);

  // Focus management
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        const input = document.querySelector(
          '[data-search-input]'
        ) as HTMLInputElement;
        input?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>समाचार खोजें</span>
          </DialogTitle>
        </DialogHeader>

        <div className="px-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              data-search-input
              placeholder="समाचार, विषय, लेखक खोजें..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-12 h-12 text-base border-2 focus:border-red-500"
              autoComplete="off"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="max-h-96 px-6 pb-6">
          {!searchQuery ? (
            // Show recent and trending searches when no query
            <div className="space-y-6 mt-4">
              {searchHistory.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium text-muted-foreground">
                      हाल की खोजें
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.map((search, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickSearch(search)}
                        className="text-sm h-8"
                      >
                        {search}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium text-muted-foreground">
                    ट्रेंडिंग खोजें
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="secondary"
                      size="sm"
                      onClick={() => handleQuickSearch(search)}
                      className="text-sm h-8"
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : isSearching ? (
            // Loading state
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-red-500" />
                <p className="text-sm text-muted-foreground">खोज रहे हैं...</p>
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            // Search results
            <div className="space-y-1 mt-4">
              <div className="text-sm text-muted-foreground mb-3">
                {searchResults.length} परिणाम मिले
              </div>
              {searchResults.map((result, index) => (
                <div
                  key={`${result.id}-${index}`}
                  className="p-4 rounded-lg hover:bg-accent cursor-pointer transition-colors border border-transparent hover:border-border"
                  onClick={() => handleResultClick(`/news/${result.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm mb-2 line-clamp-2">
                        {result.title}
                      </h4>
                      {result.excerpt && (
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {result.excerpt}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        {result.category && (
                          <Badge variant="outline" className="text-xs">
                            {result.category}
                          </Badge>
                        )}
                        {result.publishedAt && (
                          <>
                            <span>•</span>
                            <span>{result.publishedAt}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground ml-3 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // No results
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">कोई परिणाम नहीं मिला</h3>
              <p className="text-sm text-muted-foreground mb-4">
                &quot;{searchQuery}&quot; के लिए कोई समाचार नहीं मिला
              </p>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">सुझाव:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• वर्तनी की जांच करें</li>
                  <li>• अलग कीवर्ड का प्रयास करें</li>
                  <li>• कम शब्दों का उपयोग करें</li>
                </ul>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
});

SearchDialog.displayName = 'SearchDialog';

export default SearchDialog;
