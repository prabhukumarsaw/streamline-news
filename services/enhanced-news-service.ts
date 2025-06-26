/**
 * Enhanced News Service
 * Created by: Prabhu
 * Description: Production-ready news service with comprehensive API integration
 */

import { apiClient } from '@/lib/api-client';
import { ApiList } from '@/lib/api-config';
import { Article, Category, BackendArticle, NewsListParams } from '@/types/news';

class EnhancedNewsService {
  /**
   * Transform backend article data to frontend format
   */
  transformArticle(backendArticle: BackendArticle): Article {
    const publicationDate = backendArticle.publication_date || '';
    const publicationTime = backendArticle.publication_time || '';
    const fullDate = publicationDate && publicationTime 
      ? `${publicationDate} ${publicationTime}` 
      : new Date().toISOString();

    return {
      id: backendArticle.story_id?.toString() || Math.random().toString(),
      title: backendArticle.story_title || 'Untitled',
      slug: backendArticle.custom_url || this.generateSlug(backendArticle.story_title || ''),
      excerpt: this.extractExcerpt(backendArticle.story_body || ''),
      content: backendArticle.story_body || '',
      image: this.getImageUrl(backendArticle.file_name),
      categoryId: backendArticle.category_id?.toString() || 'general',
      authorId: backendArticle.author_id?.toString() || backendArticle.story_author?.toString() || '1',
      publishedAt: fullDate,
      trending: backendArticle.is_visible === 1,
      featured: backendArticle.sequence === 1,
      tags: this.extractTags(backendArticle.ct_tag_name),
      readTime: this.calculateReadTime(backendArticle.story_body || ''),
      views: Math.floor(Math.random() * 10000) + 100,
    };
  }

  /**
   * Transform backend category data to frontend format
   */
  transformCategory(backendCategory: any): Category {
    return {
      id: Number(backendCategory.id) || 0,
      category: backendCategory.category || 'Uncategorized',
      cat_in_english: backendCategory.cat_in_english || backendCategory.category || 'Uncategorized',
      serial: Number(backendCategory.serial) || 0,
      created_date: backendCategory.created_date || '',
      renderer_code: backendCategory.renderer_code || '',
    };
  }

  /**
   * Get active news list with enhanced error handling
   */
  async getActiveNewsList(params: NewsListParams = {}) {
    try {
      const response = await apiClient.post(ApiList.api_getActiveNewsList, params);
      
      if (response.status && response.data?.data) {
        const articles = Array.isArray(response.data.data) 
          ? response.data.data.map((item: BackendArticle) => this.transformArticle(item))
          : [];

        return {
          articles,
          pagination: {
            currentPage: response.data.current_page || 1,
            totalPages: response.data.last_page || 1,
            totalItems: response.data.total || articles.length,
            itemsPerPage: response.data.per_page || 10,
          }
        };
      }

      return { articles: [], pagination: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 } };
    } catch (error) {
      console.error('❌ Failed to fetch active news list:', error);
      return { articles: [], pagination: { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 } };
    }
  }

  /**
   * Get single news article
   */
  async getNewsArticle(params: { id?: string; slug?: string }) {
    try {
      const response = await apiClient.post(ApiList.api_getNews, params);
      
      if (response.status && response.data) {
        return this.transformArticle(response.data);
      }
      
      return null;
    } catch (error) {
      console.error('❌ Failed to fetch article:', error);
      return null;
    }
  }

  /**
   * Get categories
   */
  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.post(ApiList.api_getCategory);
      
      if (response.status && Array.isArray(response.data)) {
        return response.data.map((item: any) => this.transformCategory(item));
      }
      
      return [];
    } catch (error) {
      console.error('❌ Failed to fetch categories:', error);
      return [];
    }
  }

  /**
   * Get trending articles
   */
  async getTrendingArticles(): Promise<Article[]> {
    try {
      const response = await apiClient.post(ApiList.api_getActiveNewsList, {
        page: 1,
        per_page: 10,
        trending: true,
      });

      if (response.status && response.data?.data) {
        return response.data.data.map((article: BackendArticle) => this.transformArticle(article));
      }

      return [];
    } catch (error) {
      console.error('❌ Failed to fetch trending articles:', error);
      return [];
    }
  }

  /**
   * Search articles
   */
  async searchArticles(query: string, params: NewsListParams = {}): Promise<Article[]> {
    try {
      const searchParams = { ...params, search: query };
      const response = await apiClient.post(ApiList.api_getActiveNewsList, searchParams);
      
      if (response.status && response.data?.data) {
        return response.data.data.map((item: BackendArticle) => this.transformArticle(item));
      }
      
      return [];
    } catch (error) {
      console.error('❌ Failed to search articles:', error);
      return [];
    }
  }

  /**
   * Get articles by category
   */
  async getNewsByCategory(categoryId: number, params: NewsListParams = {}): Promise<Article[]> {
    try {
      const fullParams = { ...params, category_id: categoryId };
      const response = await apiClient.post(ApiList.api_getActiveNewsList, fullParams);
      
      if (response.status && response.data?.data) {
        return response.data.data.map((item: BackendArticle) => this.transformArticle(item));
      }
      
      return [];
    } catch (error) {
      console.error('❌ Failed to fetch category news:', error);
      return [];
    }
  }

  /**
   * Get featured articles for hero section
   */
  async getFeaturedArticles(): Promise<Article[]> {
    try {
      const response = await apiClient.post(ApiList.api_getActiveNewsList, {
        page: 1,
        per_page: 5,
        sort_by: 'publication_date',
        sort_order: 'desc',
      });

      if (response.status && response.data?.data) {
        return response.data.data.map((article: BackendArticle) => this.transformArticle(article));
      }

      return [];
    } catch (error) {
      console.error('❌ Failed to fetch featured articles:', error);
      return [];
    }
  }

  /**
   * Get breaking news
   */
  async getBreakingNews(): Promise<Article[]> {
    try {
      const response = await apiClient.post(ApiList.api_getActiveNewsList, {
        page: 1,
        per_page: 3,
        sort_by: 'publication_date',
        sort_order: 'desc',
      });

      if (response.status && response.data?.data) {
        return response.data.data
          .slice(0, 3)
          .map((article: BackendArticle) => this.transformArticle(article));
      }

      return [];
    } catch (error) {
      console.error('❌ Failed to fetch breaking news:', error);
      return [];
    }
  }

  // Helper methods
  private generateSlug(title: string): string {
    if (!title) return '';
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }

  private extractExcerpt(content: string): string {
    if (!content) return '';
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
  }

  private getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) {
      return 'https://images.pexels.com/photos/3825572/pexels-photo-3825572.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&dpr=1';
    }

    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || 'https://live.framework-futuristic.com';
    return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  }

  private extractTags(tags: string | undefined): string[] {
    if (!tags) return [];
    
    if (typeof tags === 'string') {
      return tags.split(',').map(tag => tag.trim()).filter(Boolean);
    }

    return [];
  }

  private calculateReadTime(content: string): number {
    if (!content) return 1;
    
    const plainText = content.replace(/<[^>]*>/g, '');
    const wordsPerMinute = 200;
    const wordCount = plainText.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute) || 1;
  }
}

export const enhancedNewsService = new EnhancedNewsService();