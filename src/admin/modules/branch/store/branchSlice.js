import { createSlice } from "@reduxjs/toolkit";

import { addKeyDto } from "@dto";
import { branchListAction } from "./thunks";

export const branchSlice = createSlice({
  name: "branch",
  initialState: {
    page: 0,
    isLoading: false,
    branchList: [],
    selectedBranch: null,
  },
  reducers: {
    clearBranch: (state) => {
      state.branchList = [];
    },
  },
  extraReducers: (builder) => {
    /** BRANCH LIST */
    builder.addCase(branchListAction.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(branchListAction.rejected, (state, { payload }) => {
      (state.isLoading = false), (state.branchList = payload?.data);
    });
    builder.addCase(branchListAction.fulfilled, (state, { payload }) => {
      (state.isLoading = false), (state.branchList = addKeyDto.addKey(payload.data));
    });
  },
});

export const { clearBranch } = branchSlice.actions;
