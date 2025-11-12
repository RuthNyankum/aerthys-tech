import { Link, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  selectCartItems,
  selectCartTotal,
  selectCartItemsCount,
} from "../redux/slices/cartSlice";
import toast from "react-hot-toast";

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartItemsCount = useSelector(selectCartItemsCount);

  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleUpdateQuantity = (productId, variant, newQuantity, stock) => {
    if (newQuantity < 1) return;

    if (newQuantity > stock) {
      toast.error(`Only ${stock} items available in stock`);
      return;
    }

    dispatch(updateQuantity({ productId, variant, quantity: newQuantity }));
  };

  const handleRemoveItem = (productId, variant) => {
    dispatch(removeFromCart({ productId, variant }));
    toast.success("Item removed from cart");
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      dispatch(clearCart());
      toast.success("Cart cleared");
    }
  };

  const shippingCost = cartTotal > 50 ? 0 : 9.99;
  const taxRate = 0.08; // 8% tax
  const tax = cartTotal * taxRate;
  const totalWithTaxAndShipping = cartTotal + tax + shippingCost;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Looks like you haven't added anything to your cart yet
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Shopping Cart
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {cartItemsCount} {cartItemsCount === 1 ? "item" : "items"} in your
              cart
            </p>
          </div>
          <button
            onClick={handleClearCart}
            className="text-red-600 dark:text-red-400 hover:underline text-sm"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={`${item._id}-${item.variant || "default"}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col sm:flex-row gap-4"
              >
                {/* Product Image */}
                <Link to={`/products/${item.slug}`} className="flex-shrink-0">
                  <img
                    src={item.image || "https://via.placeholder.com/150"}
                    alt={item.name}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </Link>

                {/* Product Details */}
                <div className="flex-1">
                  <Link to={`/products/${item.slug}`} className="block">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      {item.name}
                    </h3>
                  </Link>

                  {item.variant && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Variant: {item.variant}
                    </p>
                  )}

                  <p className="text-xl font-bold text-primary-600 dark:text-primary-400 mt-2">
                    ${item.price}
                  </p>

                  {/* Stock Status */}
                  {item.stock < 10 && item.stock > 0 && (
                    <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                      Only {item.stock} left in stock
                    </p>
                  )}
                  {item.stock === 0 && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      Out of stock
                    </p>
                  )}

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-lg">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item._id,
                            item.variant,
                            item.quantity - 1,
                            item.stock
                          )
                        }
                        disabled={item.quantity <= 1}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(
                            item._id,
                            item.variant,
                            item.quantity + 1,
                            item.stock
                          )
                        }
                        disabled={item.quantity >= item.stock}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item._id, item.variant)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal ({cartItemsCount} items)</span>
                  <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shippingCost === 0 ? (
                      <span className="text-green-600 dark:text-green-400">
                        FREE
                      </span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>

                {/* Free Shipping Notice */}
                {cartTotal < 50 && (
                  <p className="text-sm text-orange-600 dark:text-orange-400">
                    Add ${(50 - cartTotal).toFixed(2)} more for free shipping!
                  </p>
                )}

                {/* Tax */}
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax (8%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>${totalWithTaxAndShipping.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast.error("Please login to proceed to checkout");
                      navigate("/login");
                    } else {
                      toast.success("Proceeding to checkout");
                      navigate("/checkout");
                    }
                  }}
                >
                  Proceed to Checkout
                </button>

                {/* Continue Shopping */}
                <Link
                  to="/products"
                  className="block w-full py-3 text-center border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Payment Methods */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  We accept
                </p>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-xs font-semibold">
                    VISA
                  </div>
                  <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-xs font-semibold">
                    Mastercard
                  </div>
                  <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-xs font-semibold">
                    PayPal
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
