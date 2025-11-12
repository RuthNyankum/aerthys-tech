// import { useState } from "react";
// function App() {
//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
//       <div className="max-w-7xl mx-auto px-4 py-16">
//         <div className="text-center">
//           <h1 className="text-5xl font-bold text-primary-600 dark:text-primary-400 mb-4">
//             Welcome to Aerthys Tech
//           </h1>
//           <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
//             Tailwind CSS v4 is working perfectly! 🎉
//           </p>
//           <div className="flex gap-4 justify-center">
//             <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
//               Primary Button
//             </button>
//             <button className="px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
//               Secondary Button
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

import { Routes, Route } from "react-router";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
