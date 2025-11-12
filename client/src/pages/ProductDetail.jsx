import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingCart,
  Heart,
  Star,
  Minus,
  Plus,
  Truck,
  Shield,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  fetchProductStart,
  fetchProductSuccess,
  fetchProductFailure,
} from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { getProductBySlug } from "../services/productService";

const ProductDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { currentProduct: product, loading } = useSelector(
    (state) => state.products
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        dispatch(fetchProductStart());
        const response = await getProductBySlug(slug);
        dispatch(fetchProductSuccess(response.data));
      } catch (error) {
        dispatch(fetchProductFailure(error.message));
        toast.error("Failed to load product");
      }
    };

    loadProduct();
  }, [slug, dispatch]);

  const handleAddToCart = () => {
    if (!product) return;

    if (product.stock === 0) {
      toast.error("Product is out of stock");
      return;
    }

    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available`);
      return;
    }

    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url,
        slug: product.slug,
        stock: product.stock,
        quantity: quantity,
        variant: selectedVariant,
      })
    );

    toast.success(`Added ${quantity} item(s) to cart`);
    setQuantity(1);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const nextImage = () => {
    if (product && product.images.length > 1) {
      setSelectedImage((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product && product.images.length > 1) {
      setSelectedImage((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="w-full h-96 bg-gray-300 dark:bg-gray-700 rounded-lg" />
                <div className="flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded"
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4" />
                <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded" />
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded" />
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Product not found
          </h2>
          <Link
            to="/products"
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  const discountPercentage = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100
      )
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
          <Link
            to="/"
            className="hover:text-primary-600 dark:hover:text-primary-400"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            to="/products"
            className="hover:text-primary-600 dark:hover:text-primary-400"
          >
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{product.name}</span>
        </nav>

        {/* Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg group">
              <img
                src={
                  product.images[selectedImage]?.url ||
                  "https://via.placeholder.com/600"
                }
                alt={product.name}
                className="w-full h-[500px] object-cover"
              />

              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-900 dark:text-white" />
                  </button>
                </>
              )}

              {/* Badges */}
              {discountPercentage > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{discountPercentage}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-primary-600 ring-2 ring-primary-200 dark:ring-primary-800"
                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Category & Brand */}
            <div className="flex items-center gap-3 text-sm">
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full">
                {product.category?.name}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {product.brand}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {product.rating > 0
                  ? `${product.rating} / 5`
                  : "No reviews yet"}
              </span>
              {product.numReviews > 0 && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ({product.numReviews} reviews)
                </span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                ${product.price}
              </span>
              {product.compareAtPrice && (
                <span className="text-2xl text-gray-500 dark:text-gray-400 line-through">
                  ${product.compareAtPrice}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    In Stock ({product.stock} available)
                  </span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    Out of Stock
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Specifications
                </h3>
                <dl className="grid grid-cols-1 gap-3">
                  {product.specifications.map((spec, index) => (
                    <div
                      key={index}
                      className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800"
                    >
                      <dt className="text-gray-600 dark:text-gray-400">
                        {spec.name}
                      </dt>
                      <dd className="text-gray-900 dark:text-white font-medium">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-lg">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-6 py-3 text-lg font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {product.stock} available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                className="p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                aria-label="Add to wishlist"
              >
                <Heart className="w-6 h-6" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                  <Truck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    Free Shipping
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    On orders over $50
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                  <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    Secure Payment
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    100% protected
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
