/**
 * News React Query Hooks
 * Created by: Prabhu
 * Description: Custom hooks for news data fetching with React Query
 */

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsService, NewsListParams, getNewsByCategory } from '@/services/news-service';

// Query keys
export const newsQueryKeys = {
  all: ['news'] as const,
  lists: () => [...newsQueryKeys.all, 'list'] as const,
  list: (params: NewsListParams) => [...newsQueryKeys.lists(), params] as const,
  details: () => [...newsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...newsQueryKeys.details(), id] as const,
  categories: () => [...newsQueryKeys.all, 'categories'] as const,
  tags: () => [...newsQueryKeys.all, 'tags'] as const,
  search: (query: string) => [...newsQueryKeys.all, 'search', query] as const,
};

// Get active news list
export const useActiveNewsList = (params: NewsListParams = {}) => {
  return useQuery({
    queryKey: newsQueryKeys.list(params),
    queryFn: () => newsService.getTrendingArticles(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

// Get single news article
export const useNewsArticle = (params: { id?: string; slug?: string }) => {
  return useQuery({
    queryKey: newsQueryKeys.detail(params.id || params.slug || ''),
    queryFn: () => newsService.getNewsArticle(params),
    enabled: !!(params.id || params.slug),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get categories
export const useCategories = () => {
  return useQuery({
    queryKey: newsQueryKeys.categories(),
    queryFn: () => newsService.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Get tags
export const useTags = (params: { tag_name?: string } = {}) => {
  return useQuery({
    queryKey: [...newsQueryKeys.tags(), params],
    queryFn: () => newsService.getTags(params),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Search news
export const useSearchNews = (query: string, params: NewsListParams = {}) => {
  return useQuery({
    queryKey: newsQueryKeys.search(query),
    queryFn: () => newsService.searchNews(query, params),
    enabled: query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get news by category
export const useNewsByCategory = (categoryId: number, params: NewsListParams = {}) => {
  return useQuery({
    queryKey: [...newsQueryKeys.list(params), 'category', categoryId],
    queryFn: () => newsService.getNewsByCategory(categoryId, params),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Infinite query for news list
export const useInfiniteNewsList = (params: NewsListParams = {}) => {
  return useInfiniteQuery({
    queryKey: [...newsQueryKeys.lists(), 'infinite', params],
    queryFn: ({ pageParam = 1 }: { pageParam?: number }) =>
      newsService.getActiveNewsList({ ...params, page: pageParam }),
    getNextPageParam: (lastPage: any) => {
      if (lastPage && typeof lastPage.current_page === 'number' && typeof lastPage.last_page === 'number') {
        return lastPage.current_page < lastPage.last_page
          ? lastPage.current_page + 1
          : undefined;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
};

// Prefetch news article
export const usePrefetchNewsArticle = () => {
  const queryClient = useQueryClient();

  return (params: { id?: string; slug?: string }) => {
    queryClient.prefetchQuery({
      queryKey: newsQueryKeys.detail(params.id || params.slug || ''),
      queryFn: () => newsService.getNewsArticle(params),
      staleTime: 10 * 60 * 1000,
    });
  };
};