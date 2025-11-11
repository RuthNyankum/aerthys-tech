import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  featuredProducts: [],
  currentProduct: null,
  categories: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    pageSize: 12,
  },
  filters: {
    category: null,
    brand: null,
    minPrice: null,
    maxPrice: null,
    search: "",
    sort: "newest",
  },
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Fetch products
    fetchProductsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload.data;
      state.pagination = action.payload.pagination;
      state.error = null;
    },
    fetchProductsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch featured products
    fetchFeaturedStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchFeaturedSuccess: (state, action) => {
      state.loading = false;
      state.featuredProducts = action.payload;
      state.error = null;
    },
    fetchFeaturedFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch single product
    fetchProductStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductSuccess: (state, action) => {
      state.loading = false;
      state.currentProduct = action.payload;
      state.error = null;
    },
    fetchProductFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch categories
    fetchCategoriesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCategoriesSuccess: (state, action) => {
      state.loading = false;
      state.categories = action.payload;
      state.error = null;
    },
    fetchCategoriesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Set filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Clear current product
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchFeaturedStart,
  fetchFeaturedSuccess,
  fetchFeaturedFailure,
  fetchProductStart,
  fetchProductSuccess,
  fetchProductFailure,
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  setFilters,
  clearFilters,
  clearCurrentProduct,
  clearError,
} = productSlice.actions;

export default productSlice.reducer;
