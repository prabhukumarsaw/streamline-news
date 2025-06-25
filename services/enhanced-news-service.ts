
/**
 * News Service
 * Created by: Prabhu
 * Description: Handles all news-related API calls with backend integration
 */


import { apiClient } from '@/lib/api-client';
import { ApiList } from '@/lib/api-config';
import { Article, Category, BackendArticle,  } from '@/types/news';

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
        return response.data.data.map((article: BackendArticle) => this.transformArticle(article));
      }

      console.log('trending articles response:', response);
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
  private transformArticle(backendArticle: BackendArticle): Article {
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
      featured: false, // Not available in the response
      tags: this.extractTags(backendArticle.ct_tag_name),
      readTime: this.calculateReadTime(backendArticle.story_body || ''),
      views: 0, // Not available in the response
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
    if (!title) return '';
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }

  /**
   * Extract excerpt from content
   */
  private extractExcerpt(content: string): string {
    if (!content) return '';
    // Remove HTML tags
    const plainText = content.replace(/<[^>]*>/g, '');
    // Take first 150 characters
    return plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
  }

  /**
   * Get full image URL
   */
  private getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) {
      return 'https://images.pexels.com/photos/3825572/pexels-photo-3825572.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&dpr=1';
    }

    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // Assuming images are served from the backend
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || 'https://live.framework-futuristic.com';
    return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  }

  /**
   * Extract tags from backend format
   */
  private extractTags(tags: string | undefined): string[] {
    if (!tags) return [];
    
    if (typeof tags === 'string') {
      return tags.split(',').map(tag => tag.trim()).filter(Boolean);
    }

    return [];
  }

  /**
   * Calculate reading time based on content length
   */
  private calculateReadTime(content: string): number {
    if (!content) return 1;
    
    // Remove HTML tags for accurate word count
    const plainText = content.replace(/<[^>]*>/g, '');
    const wordsPerMinute = 200;
    const wordCount = plainText.split(/\s+/).length;
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