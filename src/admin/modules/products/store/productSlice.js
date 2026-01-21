import { createSlice } from "@reduxjs/toolkit";
import { productsListAction } from "./thunks";

import { addKeyDto } from "@dto";

export const productSlice = createSlice({
  name: "products",
  initialState: {
    page: 0,
    isLoading: false,
    productsList: [],
    selectedProducts: null,
  },
  reducers: {
    clearProducts: (state) => {
      state.productsList = [];
    },
  },
  extraReducers: (builder) => {
    /** PRODUCTS LIST */
    builder.addCase(productsListAction.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(productsListAction.rejected, (state, { payload }) => {
      (state.isLoading = false), (state.productsList = payload?.data);
    });
    builder.addCase(productsListAction.fulfilled, (state, { payload }) => {
      (state.isLoading = false), (state.productsList = addKeyDto.addKey(payload.data));
    });
  },
});

export const { clearProducts } = productSlice.actions;
