'use client';

import { useState, useEffect } from 'react';
import { Search, Clock, TrendingUp, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SearchResult {
  id: string;
  title: string;
  type: 'article' | 'category' | 'author';
  href: string;
  description?: string;
  timestamp?: Date;
  category?: string;
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    title: 'Climate Change Summit 2024: World Leaders Gather',
    type: 'article',
    href: '/articles/climate-summit-2024',
    description: 'Global leaders convene to discuss urgent climate action',
    timestamp: new Date(),
    category: 'World',
  },
  {
    id: '2',
    title: 'Technology',
    type: 'category',
    href: '/category/technology',
    description: 'Latest technology news and innovations',
  },
  {
    id: '3',
    title: 'Dr. Sarah Johnson',
    type: 'author',
    href: '/author/sarah-johnson',
    description: 'Environmental Science Correspondent',
  },
];

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches] = useState<string[]>([
    'Climate change',
    'AI technology',
    'Economic policy',
    'Sports news',
  ]);

  useEffect(() => {
    if (searchValue.length > 2) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setResults(
          mockSearchResults.filter((result) =>
            result.title.toLowerCase().includes(searchValue.toLowerCase())
          )
        );
        setIsLoading(false);
      }, 300);
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [searchValue]);

  const handleSelect = (href: string) => {
    window.location.href = href;
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <Command className="rounded-lg border-0 shadow-none">
          <CommandInput
            placeholder="Search articles, topics, authors..."
            value={searchValue}
            onValueChange={setSearchValue}
            className="border-0 focus:ring-0"
          />
          <CommandList className="max-h-96">
            {isLoading && (
              <div className="p-6 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            )}

            {!isLoading && searchValue.length <= 2 && (
              <CommandGroup heading="Recent Searches">
                {recentSearches.map((search, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => {
                      setSearchValue(search);
                    }}
                    className="flex items-center space-x-2"
                  >
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{search}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {!isLoading && results.length > 0 && (
              <>
                <CommandGroup heading="Search Results">
                  {results.map((result) => (
                    <CommandItem
                      key={result.id}
                      onSelect={() => handleSelect(result.href)}
                      className="flex items-start space-x-3 p-4"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {result.type === 'article' && (
                          <Search className="h-4 w-4 text-blue-500" />
                        )}
                        {result.type === 'category' && (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        )}
                        {result.type === 'author' && (
                          <User className="h-4 w-4 text-purple-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <div className="font-medium text-sm truncate">
                            {result.title}
                          </div>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {result.type}
                          </Badge>
                          {result.category && (
                            <Badge variant="secondary" className="text-xs">
                              {result.category}
                            </Badge>
                          )}
                        </div>
                        {result.description && (
                          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {result.description}
                          </div>
                        )}
                        {result.timestamp && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {result.timestamp.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </>
            )}

            {!isLoading && searchValue.length > 2 && results.length === 0 && (
              <CommandEmpty>
                <div className="text-center py-6">
                  <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <div className="text-sm font-medium">No results found</div>
                  <div className="text-xs text-muted-foreground">
                    Try searching for something else
                  </div>
                </div>
              </CommandEmpty>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
