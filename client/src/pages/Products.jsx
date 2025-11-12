import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, SlidersHorizontal, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  setFilters,
} from "../redux/slices/productSlice";
import { getProducts, getCategories } from "../services/productService";
import ProductCard from "../components/product/ProductCard";
import FilterSidebar from "../components/product/FilterSidebar";
import Pagination from "../components/common/Pagination";

const Products = () => {
  const dispatch = useDispatch();
  const { products, categories, loading, pagination, filters } = useSelector(
    (state) => state.products
  );

  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [localFilters, setLocalFilters] = useState(filters);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        dispatch(fetchCategoriesStart());
        const response = await getCategories();
        dispatch(fetchCategoriesSuccess(response.data));
      } catch (error) {
        dispatch(fetchCategoriesFailure(error.message));
      }
    };

    loadCategories();
  }, [dispatch]);

  // Load products when filters change
  useEffect(() => {
    const loadProducts = async () => {
      try {
        dispatch(fetchProductsStart());

        // Build query params
        const params = {
          page: pagination.currentPage,
          ...(localFilters.category && { category: localFilters.category }),
          ...(localFilters.brand && { brand: localFilters.brand }),
          ...(localFilters.minPrice && { minPrice: localFilters.minPrice }),
          ...(localFilters.maxPrice && { maxPrice: localFilters.maxPrice }),
          ...(localFilters.search && { search: localFilters.search }),
          ...(localFilters.sort && { sort: localFilters.sort }),
        };

        const response = await getProducts(params);
        dispatch(fetchProductsSuccess(response));
      } catch (error) {
        dispatch(fetchProductsFailure(error.message));
        toast.error("Failed to load products");
      }
    };

    loadProducts();
  }, [dispatch, localFilters, pagination.currentPage]);

  const handleFilterChange = (newFilters) => {
    setLocalFilters(newFilters);
    dispatch(setFilters(newFilters));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    handleFilterChange({ ...localFilters, search: searchInput });
  };

  const handleSortChange = (e) => {
    handleFilterChange({ ...localFilters, sort: e.target.value });
  };

  const handlePageChange = (page) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Update pagination in Redux if needed
  };

  // Get unique brands from products
  const brands = [...new Set(products.map((p) => p.brand))].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            All Products
          </h1>

          {/* Search and Sort Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput("");
                      handleFilterChange({ ...localFilters, search: "" });
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </form>

            {/* Sort */}
            <select
              value={localFilters.sort || "newest"}
              onChange={handleSortChange}
              className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <FilterSidebar
              filters={localFilters}
              onFilterChange={handleFilterChange}
              categories={categories}
              brands={brands}
            />
          </aside>

          {/* Filters Sidebar - Mobile */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={() => setShowFilters(false)}
              />
              <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white dark:bg-gray-800 overflow-y-auto">
                <div className="p-4">
                  <FilterSidebar
                    filters={localFilters}
                    onFilterChange={handleFilterChange}
                    categories={categories}
                    brands={brands}
                    onClose={() => setShowFilters(false)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {products.length} of {pagination.totalProducts} products
              </p>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse"
                  >
                    <div className="w-full h-64 bg-gray-300 dark:bg-gray-700" />
                    <div className="p-4">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-4" />
                      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                  No products found
                </p>
                <button
                  onClick={() =>
                    handleFilterChange({
                      category: null,
                      brand: null,
                      minPrice: null,
                      maxPrice: null,
                      search: "",
                      sort: "newest",
                    })
                  }
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
