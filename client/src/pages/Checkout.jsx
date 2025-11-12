// src/pages/Checkout.jsx
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import {
  CreditCard,
  MapPin,
  ShoppingBag,
  CheckCircle,
  Lock,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  selectCartItems,
  selectCartTotal,
  selectCartItemsCount,
  clearCart,
} from "../redux/slices/cartSlice";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const shippingCost = cartTotal > 50 ? 0 : 9.99;
  const taxRate = 0.08;
  const tax = cartTotal * taxRate;
  const total = cartTotal + tax + shippingCost;

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Your cart is empty
          </h2>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentChange = (e) => {
    let value = e.target.value;

    // Format card number with spaces
    if (e.target.name === "cardNumber") {
      value = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
    }

    // Format expiry date
    if (e.target.name === "expiryDate") {
      value = value.replace(/\D/g, "").replace(/(\d{2})(\d{0,2})/, "$1/$2");
    }

    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: value,
    });
  };

  const validateShipping = () => {
    if (!shippingInfo.firstName || !shippingInfo.lastName) {
      toast.error("Please enter your full name");
      return false;
    }
    if (!shippingInfo.email) {
      toast.error("Please enter your email");
      return false;
    }
    if (!shippingInfo.phone) {
      toast.error("Please enter your phone number");
      return false;
    }
    if (
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.state ||
      !shippingInfo.zipCode
    ) {
      toast.error("Please complete your address");
      return false;
    }
    return true;
  };

  const validatePayment = () => {
    if (
      !paymentInfo.cardNumber ||
      paymentInfo.cardNumber.replace(/\s/g, "").length !== 16
    ) {
      toast.error("Please enter a valid card number");
      return false;
    }
    if (!paymentInfo.cardName) {
      toast.error("Please enter cardholder name");
      return false;
    }
    if (!paymentInfo.expiryDate || paymentInfo.expiryDate.length !== 5) {
      toast.error("Please enter valid expiry date (MM/YY)");
      return false;
    }
    if (!paymentInfo.cvv || paymentInfo.cvv.length !== 3) {
      toast.error("Please enter valid CVV");
      return false;
    }
    return true;
  };

  const handleContinueToPayment = () => {
    if (validateShipping()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handleContinueToReview = () => {
    if (validatePayment()) {
      setStep(3);
      window.scrollTo(0, 0);
    }
  };

  const handlePlaceOrder = async () => {
    // In production, you would:
    // 1. Send order to backend API
    // 2. Process payment with Stripe
    // 3. Clear cart on success
    // 4. Navigate to order confirmation

    try {
      toast.success("Order placed successfully! (Demo mode)");

      // Clear cart after successful order
      setTimeout(() => {
        dispatch(clearCart());
        navigate("/");
      }, 2000);
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[
              { num: 1, label: "Shipping" },
              { num: 2, label: "Payment" },
              { num: 3, label: "Review" },
            ].map((item, index) => (
              <div key={item.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step >= item.num
                        ? "bg-primary-600 text-white"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {step > item.num ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      item.num
                    )}
                  </div>
                  <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                    {item.label}
                  </span>
                </div>
                {index < 2 && (
                  <div
                    className={`w-24 h-1 mx-2 ${
                      step > item.num
                        ? "bg-primary-600"
                        : "bg-gray-300 dark:bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Shipping Information
                  </h2>
                </div>

                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={shippingInfo.firstName}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={shippingInfo.lastName}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Street address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => navigate("/cart")}
                      className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Back to Cart
                    </button>
                    <button
                      type="button"
                      onClick={handleContinueToPayment}
                      className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Payment Information */}
            {step === 2 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Payment Information
                  </h2>
                </div>

                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Your payment information is secure and encrypted
                  </p>
                </div>

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentInfo.cardNumber}
                      onChange={handlePaymentChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={paymentInfo.cardName}
                      onChange={handlePaymentChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={paymentInfo.expiryDate}
                        onChange={handlePaymentChange}
                        placeholder="MM/YY"
                        maxLength="5"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={paymentInfo.cvv}
                        onChange={handlePaymentChange}
                        placeholder="123"
                        maxLength="3"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleContinueToReview}
                      className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Continue to Review
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Order Review */}
            {step === 3 && (
              <div className="space-y-6">
                {/* Shipping Details */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Shipping Address
                    </h3>
                    <button
                      onClick={() => setStep(1)}
                      className="text-primary-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {shippingInfo.firstName} {shippingInfo.lastName}
                    <br />
                    {shippingInfo.address}
                    <br />
                    {shippingInfo.city}, {shippingInfo.state}{" "}
                    {shippingInfo.zipCode}
                    <br />
                    {shippingInfo.phone}
                  </p>
                </div>

                {/* Payment Details */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Payment Method
                    </h3>
                    <button
                      onClick={() => setStep(2)}
                      className="text-primary-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Card ending in {paymentInfo.cardNumber.slice(-4)}
                    <br />
                    {paymentInfo.cardName}
                  </p>
                </div>

                {/* Order Items */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Order Items
                  </h3>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={`${item._id}-${item.variant}`}
                        className="flex gap-4"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0
                      ? "FREE"
                      : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
