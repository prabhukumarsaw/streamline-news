/**
 * Enhanced News Service
 * Created by:  postgres
 * Description: Production-ready service with consistent methods and centralized export
 */

//  postgres: This service previously used Laravel API. Refactor to use Next.js server actions and Drizzle ORM.

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
  category_id?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

class NewsService {
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
     * Get trending articles
     */
    async getTrendingArticles(): Promise<Article[]> {
      try {
        const response = await apiClient.post(ApiList.api_getActiveNewsList, {
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
   * Get single news article by slug or ID
   */
  async getNewsArticle(params: { id?: string; slug?: string }): Promise<Article | null> {
    try {
      const response = await apiClient.post(ApiList.api_getNews, params);
      console.log('News article response:', response);
      return this.transformArticle(response.data);
    } catch (error) {
      console.error('❌ Failed to fetch article:', error);
      return null;
    }
  }

  /**
   * Get all news categories
   */
  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.post(ApiList.api_getCategory, {});
      const rawData = response.data || [];
      console.log('Categories response:', response);
      return Array.isArray(rawData) ? rawData.map(this.transformCategory) : [];
    } catch (error) {
      console.error('❌ Failed to fetch categories:', error);
      return [];
    }
  }

  /**
   * Get all tags/media
   */
  async getTags(params: { tag_name?: string } = {}): Promise<string[]> {
    try {
      const response = await apiClient.post(ApiList.api_getTag, params);
      const rawTags = response.data || [];
      console.log('Tags response:', response);
      return this.extractTags(rawTags);
    } catch (error) {
      console.error('❌ Failed to fetch tags:', error);
      return [];
    }
  }

  /**
   * Search news with a keyword
   */
  async searchNews(query: string, params: NewsListParams = {}): Promise<Article[]> {
    try {
      const searchParams = { ...params, search: query };
      const response = await apiClient.post(ApiList.api_getActiveNewsList, searchParams);
      return Array.isArray(response.data?.data)
        ? response.data.data.map(this.transformArticle)
        : [];
    } catch (error) {
      console.error('❌ Failed to search news:', error);
      return [];
    }
  }

  /**
   * Get news filtered by category
   */
  async getNewsByCategory(categoryId: number, params: NewsListParams = {}): Promise<Article[]> {
    try {
      const fullParams = { ...params, category_id: categoryId };
      const response = await apiClient.post(ApiList.api_getActiveNewsList, fullParams);
      // if (response.data.status && response.data?.data) {
      //   return response.data?.data.map(this.transformArticle);
      // }
      
      return response.data?.data;
    } catch (error) {
      console.error('❌ Failed to fetch category news:', error);
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

// ✅ Singleton instance
export const newsService = new NewsService();

// ✅ Named exports (optional usage in components or hooks)
export const getActiveNewsList = newsService.getActiveNewsList.bind(newsService);
export const getNewsArticle = newsService.getNewsArticle.bind(newsService);
export const getCategories = newsService.getCategories.bind(newsService);
export const getTags = newsService.getTags.bind(newsService);
export const getTrendingNews = () => newsService.getTrendingArticles();
export const searchNews = newsService.searchNews.bind(newsService);
export const getNewsByCategory = newsService.getNewsByCategory.bind(newsService);
