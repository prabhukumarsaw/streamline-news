/**
 * API Configuration
 * Created by: Prabhu
 * Description: Centralized API endpoints configuration
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://live.framework-futuristic.com/api';

export const ApiList = {
  // Authorization APIs
  apiRegister: `${API_BASE_URL}/auth/register`,
  apiLogin: `${API_BASE_URL}/auth/login`,
  apiLogout: `${API_BASE_URL}/auth/logout`,
  
  // Career Form
  apiCareerForm: `${API_BASE_URL}/v1/job/apply`,
  
  // Career Applied List
  api_getCareerList: `${API_BASE_URL}/v1/job/list`,
  
  // News Master List
  api_getNews: `${API_BASE_URL}/crud/story/v1/show`,
  api_addNews: `${API_BASE_URL}/crud/story/v1/store`,
  api_updateNews: `${API_BASE_URL}/crud/story/v1/edit`,
  api_deleteNews: `${API_BASE_URL}/crud/story/v1/delete`,
  
  // Active News Master List
  api_getActiveNewsList: `${API_BASE_URL}/crud/active-story/v1/news-list`,
  api_getActiveNews: `${API_BASE_URL}/crud/active-story/v1/show`,
  api_addActiveNews: `${API_BASE_URL}/crud/active-story/v1/store`,
  api_updateActiveNews: `${API_BASE_URL}/crud/story/v1/edit`,
  api_deleteActiveNews: `${API_BASE_URL}/crud/story/v1/deactive-active`,
  
  // Category List
  api_getCategory: `${API_BASE_URL}/crud/category/v1/show`,
  api_addCategory: `${API_BASE_URL}/crud/category/v1/store`,
  api_updateCategory: `${API_BASE_URL}/crud/category/v1/edit`,
  api_deleteCategory: `${API_BASE_URL}/crud/category/v1/delete`,
  
  // Media Master
  api_getMedia: `${API_BASE_URL}/crud/media/v1/show`,
  api_updateMedia: `${API_BASE_URL}/crud/media/v1/edit`,
  api_addMedia: `${API_BASE_URL}/crud/media/v1/store`,
  api_deleteMedia: `${API_BASE_URL}/crud/media/v1/delete`,
  
  // Tag Master
  api_getTag: `${API_BASE_URL}/crud/tag/v1/show`,
  api_addTag: `${API_BASE_URL}/crud/tag/v1/store`,
  api_updateTag: `${API_BASE_URL}/crud/tag/v1/edit`,
  api_deleteTag: `${API_BASE_URL}/crud/tag/v1/delete`,
};

export const getApiHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  return {
    timeout: 60000,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'API-KEY': 'eff41ef6-d430-4887-aa55-9fcf46c72c99'
    },
  };
};

export const getMultipartHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
      'API-KEY': 'eff41ef6-d430-4887-aa55-9fcf46c72c99'
    },
  };
};