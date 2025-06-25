
/**
 * News Service
 * Created by: Prabhu
 * Description: Handles all news-related API calls with backend integration
 */


import { apiClient } from '@/lib/api-client';
import { Article, Category, Author } from '@/types/news';

/**
 * News service class
 * Handles all news operations with Laravel backend
 */
class NewsService {
  /**
   * Get all news articles with pagination
   */
  async getArticles(params: {
    page?: number;
    limit?: number;
    category?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}): Promise<{
    articles: Article[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  }> {
    try {
      const response = await apiClient.post('/crud/active-story/v1/news-list', {
        page: params.page || 1,
        per_page: params.limit || 10,
        category_id: params.category,
        sort_by: params.sortBy || 'created_at',
        sort_order: params.sortOrder || 'desc',
      });

      if (response.status && response.data) {
        const articles = response.data.data?.map(this.transformArticle) || [];
        
        return {
          articles,
          currentPage: response.data.current_page || 1,
          totalPages: response.data.last_page || 1,
          totalItems: response.data.total || 0,
          itemsPerPage: response.data.per_page || 10,
        };
      }

      return {
        articles: [],
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
      };
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      return {
        articles: [],
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
      };
    }
  }

  /**
   * Get single article by slug
   */
  async getArticle(slug: string): Promise<Article | null> {
    try {
      const response = await apiClient.post('/crud/story/v1/show', {
        slug: slug,
      });
      console.log('Article response:', response);

      if (response.status && response.data) {
        return this.transformArticle(response.data);
      }

      return null;
    } catch (error) {
      console.error('Failed to fetch article:', error);
      return null;
    }
  }

  /**
   * Get trending articles
   */
  async getTrendingArticles(): Promise<Article[]> {
    try {
      const response = await apiClient.post('/crud/active-story/v1/news-list', {
        page: 1,
        per_page: 5,
        trending: true,
      });

      if (response.status && response.data?.data) {
        return response.data.data.map(this.transformArticle);
      }

      return [];
    } catch (error) {
      console.error('Failed to fetch trending articles:', error);
      return [];
    }
  }

  /**
   * Search articles
   */
  async searchArticles(query: string): Promise<Article[]> {
    try {
      const response = await apiClient.post('/crud/active-story/v1/news-list', {
        search: query,
        page: 1,
        per_page: 20,
      });

      if (response.status && response.data?.data) {
        return response.data.data.map(this.transformArticle);
      }

      return [];
    } catch (error) {
      console.error('Failed to search articles:', error);
      return [];
    }
  }

/**
 * Get categories
 */
async getCategories(): Promise<Category[]> {
  try {
    const response = await apiClient.post('/crud/category/v1/show');

     console.log('🛠 API raw response:', response.data);


    if (response && Array.isArray(response.data)) {
      return response.data.map((item: any) => this.transformCategory(item));
    }

   return [];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}


  /**
   * Get articles by category
   */
  async getNewsByCategory(categoryId: string): Promise<Article[]> {
    try {
      const response = await apiClient.post('/crud/active-story/v1/news-list', {
        category_id: categoryId,
        page: 1,
        per_page: 10,
      });

      if (response.status && response.data?.data) {
        return response.data.data.map(this.transformArticle);
      }

      return [];
    } catch (error) {
      console.error('Failed to fetch articles by category:', error);
      return [];
    }
  }

  /**
   * Get related articles
   */
  async getRelatedNews(categoryId: string, currentSlug: string): Promise<Article[]> {
    try {
      const response = await apiClient.post('/crud/active-story/v1/news-list', {
        category_id: categoryId,
        exclude_slug: currentSlug,
        page: 1,
        per_page: 4,
      });

      if (response.status && response.data?.data) {
        return response.data.data.map(this.transformArticle);
      }

      return [];
    } catch (error) {
      console.error('Failed to fetch related articles:', error);
      return [];
    }
  }

  /**
   * Transform backend article data to frontend format
   */
  private transformArticle(backendArticle: any): Article {
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

/**
 * Transform backend category data to frontend format
 */
private transformCategory(backendCategory: any): Category {
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
   * Generate slug from title
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Get full image URL
   */
  private getImageUrl(imagePath: string): string {
    if (!imagePath) {
      return 'https://images.pexels.com/photos/3825572/pexels-photo-3825572.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&dpr=1';
    }

    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // Assuming images are served from the backend
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || 'https://live.framework-futuristic.com';
    return `${baseUrl}/storage/${imagePath}`;
  }

  /**
   * Extract tags from backend format
   */
  private extractTags(tags: any): string[] {
    if (Array.isArray(tags)) {
      return tags.map(tag => typeof tag === 'string' ? tag : tag.name || tag.title || '').filter(Boolean);
    }
    
    if (typeof tags === 'string') {
      return tags.split(',').map(tag => tag.trim()).filter(Boolean);
    }

    return [];
  }

  /**
   * Calculate reading time based on content length
   */
  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute) || 1;
  }
}

// Export singleton instance
export const newsService = new NewsService();

// Export individual functions for backward compatibility
export const getAllNewsArticles = () => newsService.getArticles();
export const getNewsArticle = (slug: string) => newsService.getArticle(slug);
export const getTrendingNews = () => newsService.getTrendingArticles();
export const getLatestNews = (page?: number, limit?: number, category?: string) => 
  newsService.getArticles({ page, limit, category });
export const getNewsByCategory = (categoryId: string) => newsService.getNewsByCategory(categoryId);
export const getCategories = newsService.getCategories.bind(newsService);
export const getRelatedNews = (categoryId: string, currentSlug: string) => 
  newsService.getRelatedNews(categoryId, currentSlug);
export const searchNews = (query: string) => newsService.searchArticles(query);