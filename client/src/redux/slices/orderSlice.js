// src/redux/slices/orderSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
      state.loading = false;
      state.error = null;
    },

    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
      state.loading = false;
      state.error = null;
    },

    addOrder: (state, action) => {
      state.orders.unshift(action.payload);
      state.loading = false;
      state.error = null;
    },

    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find((o) => o._id === orderId);
      if (order) {
        order.orderStatus = status;
      }
      if (state.currentOrder?._id === orderId) {
        state.currentOrder.orderStatus = status;
      }
    },

    setOrderLoading: (state, action) => {
      state.loading = action.payload;
    },

    setOrderError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearOrderError: (state) => {
      state.error = null;
    },

    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
});

export const {
  setOrders,
  setCurrentOrder,
  addOrder,
  updateOrderStatus,
  setOrderLoading,
  setOrderError,
  clearOrderError,
  clearCurrentOrder,
} = orderSlice.actions;

// Selectors
export const selectOrders = (state) => state.order.orders;
export const selectCurrentOrder = (state) => state.order.currentOrder;
export const selectOrderLoading = (state) => state.order.loading;
export const selectOrderError = (state) => state.order.error;

export default orderSlice.reducer;
