import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
  },

  // 🔹 Middleware configuration
  // Redux Toolkit automatically includes some default middleware:
  // - thunk: allows async logic like API calls
  // - immutableCheck: warns if you mutate state directly
  // - serializableCheck: warns if you store non-serializable data
  //
  // Here, i'm using getDefaultMiddleware() to include all defaults,
  // but i'm turning off the serializableCheck to avoid warnings when
  // storing things like Date, File, or FormData objects.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
