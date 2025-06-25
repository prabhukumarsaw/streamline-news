/**
 * Enhanced News Service
 * Created by: Prabhu
 * Description: Production-ready news service with React Query integration
 */

import { apiClient } from '@/lib/api-client';
import { ApiList } from '@/lib/api-config';
import { Article, Category, Author } from '@/types/news';

export interface NewsResponse {
  status: boolean;
  message: string;
  data: any[];
  current_page?: number;
  last_page?: number;
  total?: number;
  per_page?: number;
}

export interface NewsListParams {
  page?: number;
  per_page?: number;
  category_id?: string;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

class EnhancedNewsService {
  // Get active news list
  async getActiveNewsList(params: NewsListParams = {}): Promise<NewsResponse> {
    try {
      const response = await apiClient.post(ApiList.api_getActiveNewsList, params);
      return response;
    } catch (error: any) {
      console.error('Failed to fetch active news:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch news');
    }
  }

  // Get single news article
  async getNewsArticle(params: { id?: string; slug?: string }): Promise<NewsResponse> {
    try {
      const response = await apiClient.post(ApiList.api_getNews, params);
      return response;
    } catch (error: any) {
      console.error('Failed to fetch article:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch article');
    }
  }

  // Get categories
  async getCategories(): Promise<NewsResponse> {
    try {
      const response = await apiClient.post(ApiList.api_getCategory, {});
      return response;
    } catch (error: any) {
      console.error('Failed to fetch categories:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  }

  // Get tags/media
  async getTags(params: { tag_name?: string } = {}): Promise<NewsResponse> {
    try {
      const response = await apiClient.post(ApiList.api_getTag, params);
      return response;
    } catch (error: any) {
      console.error('Failed to fetch tags:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch tags');
    }
  }

  // Search news
  async searchNews(query: string, params: NewsListParams = {}): Promise<NewsResponse> {
    try {
      const searchParams = { ...params, search: query };
      const response = await apiClient.post(ApiList.api_getActiveNewsList, searchParams);
      return response;
    } catch (error: any) {
      console.error('Failed to search news:', error);
      throw new Error(error.response?.data?.message || 'Search failed');
    }
  }

  // Get news by category
  async getNewsByCategory(categoryId: string, params: NewsListParams = {}): Promise<NewsResponse> {
    try {
      const categoryParams = { ...params, category_id: categoryId };
      const response = await apiClient.post(ApiList.api_getActiveNewsList, categoryParams);
      return response;
    } catch (error: any) {
      console.error('Failed to fetch news by category:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch category news');
    }
  }

  // Transform backend data to frontend format
  transformArticle(backendArticle: any): Article {
    return {
      id: backendArticle.id?.toString() || Math.random().toString(),
      title: backendArticle.title || backendArticle.headline || 'Untitled',
      slug: backendArticle.slug || this.generateSlug(backendArticle.title || backendArticle.headline),
      excerpt: backendArticle.excerpt || backendArticle.summary || backendArticle.description || '',
      content: backendArticle.content || backendArticle.body || '',
      image: this.getImageUrl(backendArticle.featured_image || backendArticle.image),
      categoryId: backendArticle.category_id?.toString() || 'general',
      authorId: backendArticle.author_id?.toString() || backendArticle.user_id?.toString() || '1',
      publishedAt: backendArticle.published_at || backendArticle.created_at || new Date().toISOString(),
      trending: backendArticle.is_trending || backendArticle.trending || false,
      featured: backendArticle.is_featured || backendArticle.featured || false,
      tags: this.extractTags(backendArticle.tags),
      readTime: this.calculateReadTime(backendArticle.content || backendArticle.body || ''),
      views: parseInt(backendArticle.views || '0') || 0,
    };
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private getImageUrl(imagePath: string): string {
    if (!imagePath) {
      return 'https://images.pexels.com/photos/3825572/pexels-photo-3825572.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&dpr=1';
    }

    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || 'https://live.framework-futuristic.com';
    return `${baseUrl}/storage/${imagePath}`;
  }

  private extractTags(tags: any): string[] {
    if (Array.isArray(tags)) {
      return tags.map(tag => typeof tag === 'string' ? tag : tag.name || tag.title || '').filter(Boolean);
    }
    
    if (typeof tags === 'string') {
      return tags.split(',').map(tag => tag.trim()).filter(Boolean);
    }

    return [];
  }

  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute) || 1;
  }
}

export const enhancedNewsService = new EnhancedNewsService();