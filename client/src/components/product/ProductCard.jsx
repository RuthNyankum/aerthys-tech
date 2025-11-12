import { Link } from "react-router";
import { ShoppingCart, Star } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation when clicking add to cart

    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url,
        slug: product.slug,
        stock: product.stock,
        quantity: 1,
      })
    );

    toast.success("Added to cart!");
  };

  const discountPercentage = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100
      )
    : 0;

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-64 bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <img
          src={product.images[0]?.url || "https://via.placeholder.com/400"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-lg">
              -{discountPercentage}%
            </span>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <span className="bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-lg">
              Low Stock
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-gray-500 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-lg">
              Out of Stock
            </span>
          )}
        </div>

        {/* Quick Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="absolute bottom-3 right-3 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Add to cart"
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category & Brand */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {product.brand}
          </span>
          {product.category?.name && (
            <>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <span className="text-xs text-primary-600 dark:text-primary-400">
                {product.category.name}
              </span>
            </>
          )}
        </div>

        {/* Product Name */}
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {product.rating > 0 ? product.rating.toFixed(1) : "New"}
          </span>
          {product.numReviews > 0 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({product.numReviews})
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ${product.price}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                ${product.compareAtPrice}
              </span>
            )}
          </div>

          {/* Stock Info */}
          {product.stock > 0 && product.stock < 10 && (
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              Only {product.stock} left in stock
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
