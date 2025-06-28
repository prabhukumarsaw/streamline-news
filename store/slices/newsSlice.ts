/**
 * News Redux Slice
 * Created by:  postgres
 * Description: Manages news articles, categories, and content-related state
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Article, Category } from '@/types/news';
import { newsService } from '@/services/news-service';

interface NewsState {
  articles: Article[];
  categories: Category[];
  featuredArticles: Article[];
  trendingArticles: Article[];
  currentArticle: Article | null;
  searchResults: Article[];
  searchQuery: string;
  filters: {
    category: string | null;
    dateRange: {
      startDate: string | null;
      endDate: string | null;
    };
    sortBy: 'date' | 'views' | 'title';
    sortOrder: 'asc' | 'desc';
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  isLoading: boolean;
  error: string | null;
}

/**
 * Initial news state
 * Default values for news management
 */
const initialState: NewsState = {
  articles: [],
  categories: [],
  featuredArticles: [],
  trendingArticles: [],
  currentArticle: null,
  searchResults: [],
  searchQuery: '',
  filters: {
    category: null,
    dateRange: {
      startDate: null,
      endDate: null,
    },
    sortBy: 'date',
    sortOrder: 'desc',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
  isLoading: false,
  error: null,
};

/**
 * Async thunk for fetching all articles
 * Loads articles with pagination and filtering
 */
export const fetchArticles = createAsyncThunk(
  'news/fetchArticles',
  async (params: {
    page?: number;
    limit?: number;
    category?: string;
    sortBy?: string;
    sortOrder?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await newsService.getArticles(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch articles');
    }
  }
);

/**
 * Async thunk for fetching single article
 * Loads detailed article data by slug
 */
export const fetchArticle = createAsyncThunk(
  'news/fetchArticle',
  async (slug: string, { rejectWithValue }) => {
    try {
      const article = await newsService.getArticle(slug);
      return article;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch article');
    }
  }
);

/**
 * Async thunk for searching articles
 * Performs full-text search across articles
 */
export const searchArticles = createAsyncThunk(
  'news/searchArticles',
  async (query: string, { rejectWithValue }) => {
    try {
      const results = await newsService.searchArticles(query);
      return results;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Search failed');
    }
  }
);

/**
 * Async thunk for fetching trending articles
 * Loads most popular articles
 */
export const fetchTrendingArticles = createAsyncThunk(
  'news/fetchTrendingArticles',
  async (_, { rejectWithValue }) => {
    try {
      const articles = await newsService.getTrendingArticles();
      return articles;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch trending articles');
    }
  }
);

/**
 * News slice with reducers and actions
 * Manages all news-related state changes
 */
const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    /**
     * Clear news error
     * Resets error state after user acknowledgment
     */
    clearNewsError: (state) => {
      state.error = null;
    },
    
    /**
     * Set search query
     * Updates current search query
     */
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    
    /**
     * Clear search results
     * Resets search results and query
     */
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
    },
    
    /**
     * Set category filter
     * Updates category filter for articles
     */
    setCategoryFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.category = action.payload;
      state.pagination.currentPage = 1; // Reset to first page
    },
    
    /**
     * Set date range filter
     * Updates date range filter for articles
     */
    setDateRangeFilter: (state, action: PayloadAction<{ startDate: string | null; endDate: string | null }>) => {
      state.filters.dateRange = action.payload;
      state.pagination.currentPage = 1; // Reset to first page
    },
    
    /**
     * Set sort options
     * Updates sorting criteria for articles
     */
    setSortOptions: (state, action: PayloadAction<{ sortBy: 'date' | 'views' | 'title'; sortOrder: 'asc' | 'desc' }>) => {
      state.filters.sortBy = action.payload.sortBy;
      state.filters.sortOrder = action.payload.sortOrder;
      state.pagination.currentPage = 1; // Reset to first page
    },
    
    /**
     * Set current page
     * Updates pagination current page
     */
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    
    /**
     * Clear filters
     * Resets all filters to default values
     */
    clearFilters: (state) => {
      state.filters = {
        category: null,
        dateRange: {
          startDate: null,
          endDate: null,
        },
        sortBy: 'date',
        sortOrder: 'desc',
      };
      state.pagination.currentPage = 1;
    },
    
    /**
     * Update article views
     * Increments view count for an article
     */
    updateArticleViews: (state, action: PayloadAction<string>) => {
      const article = state.articles.find(a => a.id === action.payload);
      if (article) {
        article.views += 1;
      }
      
      if (state.currentArticle && state.currentArticle.id === action.payload) {
        state.currentArticle.views += 1;
      }
    },
    
    /**
     * Reset news state
     * Resets news state to initial values
     */
    resetNewsState: (state) => {
      state.articles = [];
      state.searchResults = [];
      state.currentArticle = null;
      state.searchQuery = '';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch articles cases
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.articles = action.payload.articles;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalItems,
          itemsPerPage: action.payload.itemsPerPage,
        };
        state.error = null;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch single article cases
    builder
      .addCase(fetchArticle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArticle.fulfilled, (state, action: PayloadAction<Article>) => {
        state.isLoading = false;
        state.currentArticle = action.payload;
        state.error = null;
      })
      .addCase(fetchArticle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Search articles cases
    builder
      .addCase(searchArticles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchArticles.fulfilled, (state, action: PayloadAction<Article[]>) => {
        state.isLoading = false;
        state.searchResults = action.payload;
        state.error = null;
      })
      .addCase(searchArticles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch trending articles cases
    builder
      .addCase(fetchTrendingArticles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTrendingArticles.fulfilled, (state, action: PayloadAction<Article[]>) => {
        state.isLoading = false;
        state.trendingArticles = action.payload;
        state.error = null;
      })
      .addCase(fetchTrendingArticles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions for use in components
export const {
  clearNewsError,
  setSearchQuery,
  clearSearchResults,
  setCategoryFilter,
  setDateRangeFilter,
  setSortOptions,
  setCurrentPage,
  clearFilters,
  updateArticleViews,
  resetNewsState,
} = newsSlice.actions;

// Export reducer for store configuration
export default newsSlice.reducer;