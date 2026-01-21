/* eslint-disable react-hooks/rules-of-hooks */
import { useApi } from "@hooks";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { endpoints } from "@utils";

const { callService } = useApi();

export const productsListAction = createAsyncThunk(
  "products/list",
  async (params, { rejectWithValue }) => {
    return await callService({
      url: `${endpoints.productsUrl.list}`,
      errorCallback: rejectWithValue,
    }).get();
  },
);
