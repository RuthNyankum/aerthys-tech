import api from "./api";

// Get all products with filters
export const getProducts = async (params = {}) => {
  const response = await api.get("/products", { params });
  return response.data;
};

// Get featured products
export const getFeaturedProducts = async () => {
  const response = await api.get("/products/featured");
  return response.data;
};

// Get single product by slug
export const getProductBySlug = async (slug) => {
  const response = await api.get(`/products/${slug}`);
  return response.data;
};

// Search products
export const searchProducts = async (query) => {
  const response = await api.get("/products/search", {
    params: { q: query },
  });
  return response.data;
};

// Get all categories
export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

// Get category by slug
export const getCategoryBySlug = async (slug) => {
  const response = await api.get(`/categories/${slug}`);
  return response.data;
};

export default {
  getProducts,
  getFeaturedProducts,
  getProductBySlug,
  searchProducts,
  getCategories,
  getCategoryBySlug,
};
