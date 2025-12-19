import api from '../lib/api';

export const categoryService = {
  // Get all active categories
  async getAllCategories() {
    const response = await api.get('/categories');
    return response.data;
  },

  // Get category by slug
  async getCategoryBySlug(slug) {
    const response = await api.get(`/categories/${slug}`);
    return response.data;
  },
};

export default categoryService;

