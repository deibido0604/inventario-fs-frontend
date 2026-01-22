import { createSlice } from "@reduxjs/toolkit";

import { addKeyDto } from "@dto";
import { branchListAction, branchListForUserAction } from "./thunks";

export const branchSlice = createSlice({
  name: "branch",
  initialState: {
    page: 0,
    isLoading: false,
    branchList: [],
    branchesForUser: [],
    selectedBranch: null,
  },
  reducers: {
    clearBranch: (state) => {
      state.branchList = [];
    },
    clearBranchForUser: (state) => {
      state.branchesForUser = [];
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

    /** BRANCH LIST FOR USERS */
    builder.addCase(branchListForUserAction.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(branchListForUserAction.rejected, (state, { payload }) => {
      (state.isLoading = false), (state.branchesForUser = payload?.data);
    });
    builder.addCase(branchListForUserAction.fulfilled, (state, { payload }) => {
      (state.isLoading = false), (state.branchesForUser = addKeyDto.addKey(payload.data));
    });
  },
});

export const { clearBranch, clearBranchForUser } = branchSlice.actions;
