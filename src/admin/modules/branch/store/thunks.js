/* eslint-disable react-hooks/rules-of-hooks */
import { useApi } from "@hooks";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { endpoints } from "@utils";

const { callService } = useApi();

export const branchListAction = createAsyncThunk(
  "branch/list",
  async (params, { rejectWithValue }) => {
    return await callService({
      url: `${endpoints.branchUrl.list}`,
      errorCallback: rejectWithValue,
    }).get();
  },
);
