import { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";

const FilterSidebar = ({
  filters = {}, // ✅ default empty object to prevent undefined
  onFilterChange = () => {}, // ✅ fallback function
  categories = [], // ✅ default empty array
  brands = [], // ✅ default empty array
  onClose,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    brand: true,
    rating: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (categoryId) => {
    onFilterChange({
      ...filters,
      category: filters?.category === categoryId ? null : categoryId,
    });
  };

  const handleBrandChange = (brand) => {
    onFilterChange({
      ...filters,
      brand: filters?.brand === brand ? null : brand,
    });
  };

  const handlePriceChange = (min, max) => {
    onFilterChange({
      ...filters,
      minPrice: min || null,
      maxPrice: max || null,
    });
  };

  const handleRatingChange = (rating) => {
    onFilterChange({
      ...filters,
      minRating: filters?.minRating === rating ? null : rating,
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      category: null,
      brand: null,
      minPrice: null,
      maxPrice: null,
      minRating: null,
      search: filters?.search || "",
    });
  };

  const hasActiveFilters =
    filters?.category ||
    filters?.brand ||
    filters?.minPrice ||
    filters?.maxPrice ||
    filters?.minRating;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sticky top-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Filters
        </h2>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Clear All
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("category")}
          className="w-full flex items-center justify-between mb-3 text-sm font-semibold text-gray-900 dark:text-white"
        >
          Categories
          {expandedSections.category ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {expandedSections.category && (
          <div className="space-y-2">
            {categories.length > 0 ? (
              categories.map((category) => (
                <label
                  key={category._id}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters?.category === category._id}
                    onChange={() => handleCategoryChange(category._id)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                    {category.name}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500">No categories available</p>
            )}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between mb-3 text-sm font-semibold text-gray-900 dark:text-white"
        >
          Price Range
          {expandedSections.price ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {expandedSections.price && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters?.minPrice || ""}
                onChange={(e) =>
                  handlePriceChange(e.target.value, filters?.maxPrice)
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters?.maxPrice || ""}
                onChange={(e) =>
                  handlePriceChange(filters?.minPrice, e.target.value)
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Quick Price Ranges */}
            <div className="space-y-2">
              {[
                { label: "Under $100", min: 0, max: 100 },
                { label: "$100 - $500", min: 100, max: 500 },
                { label: "$500 - $1000", min: 500, max: 1000 },
                { label: "Over $1000", min: 1000, max: null },
              ].map((range) => (
                <button
                  key={range.label}
                  onClick={() => handlePriceChange(range.min, range.max)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                    filters?.minPrice === range.min &&
                    filters?.maxPrice === range.max
                      ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => toggleSection("brand")}
            className="w-full flex items-center justify-between mb-3 text-sm font-semibold text-gray-900 dark:text-white"
          >
            Brands
            {expandedSections.brand ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {expandedSections.brand && (
            <div className="space-y-2">
              {brands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters?.brand === brand}
                    onChange={() => handleBrandChange(brand)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Rating */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("rating")}
          className="w-full flex items-center justify-between mb-3 text-sm font-semibold text-gray-900 dark:text-white"
        >
          Rating
          {expandedSections.rating ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {expandedSections.rating && (
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label
                key={rating}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters?.minRating === rating}
                  onChange={() => handleRatingChange(rating)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  {rating}★ & up
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;
