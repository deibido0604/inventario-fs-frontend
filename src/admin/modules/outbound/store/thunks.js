/* eslint-disable react-hooks/rules-of-hooks */
import { useApi } from "@hooks";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { endpoints } from "@utils";

const { callService } = useApi();

export const availableProductListAction = createAsyncThunk(
  "availableProduct/list",
  async (params, { rejectWithValue }) => {
    return await callService({
      url: endpoints.outboundUrl.availableProductList,
      errorCallback: rejectWithValue,
    }).get({ params: { branchId: params.branchId } });
  },
);

export const checkProductAvailabilityAction = createAsyncThunk(
  "outbound/checkAvailability",
  async (params, { rejectWithValue }) => {
    return await callService({
      url: endpoints.outboundUrl.checkAvailability,
      errorCallback: rejectWithValue,
    }).post(params);
  },
);

export const checkBranchLimitAction = createAsyncThunk(
  "outbound/checkBranchLimit",
  async (params, { rejectWithValue }) => {
    const { branchId } = params;
    return await callService({
      url: `${endpoints.outboundUrl.checkBranchLimit}/${branchId}`,
      errorCallback: rejectWithValue,
    }).get();
  },
);

export const createOutboundAction = createAsyncThunk(
  "outbound/create",
  async (params, { rejectWithValue }) => {
    return await callService({
      url: endpoints.outboundUrl.createOutbound,
      errorCallback: rejectWithValue,
    }).post(params);
  },
);

export const listOutboundsAction = createAsyncThunk(
  "outbound/list",
  async (params, { rejectWithValue }) => {
    return await callService({
      url: endpoints.outboundUrl.listOutbounds,
      errorCallback: rejectWithValue,
    }).get({ params });
  },
);

export const receiveOutboundAction = createAsyncThunk(
  "outbound/receive",
  async (params, { rejectWithValue }) => {
    const { id, ...rest } = params;
    return await callService({
      url: `${endpoints.outboundUrl.receiveOutbound}/${id}`,
      errorCallback: rejectWithValue,
    }).post(rest);
  },
);

export const getOutboundDetailsAction = createAsyncThunk(
  "outbound/details",
  async (params, { rejectWithValue }) => {
    const { id, ...rest } = params;
    return await callService({
      url: `${endpoints.outboundUrl.getOutboundDetails}/${id}`,
      errorCallback: rejectWithValue,
    }).get({ params: rest });
  },
);

export const getOutboundStatsAction = createAsyncThunk(
  "outbound/stats",
  async (params, { rejectWithValue }) => {
    return await callService({
      url: endpoints.outboundUrl.getOutboundStats,
      errorCallback: rejectWithValue,
    }).get({ params });
  },
);

export const cancelOutboundAction = createAsyncThunk(
  "outbound/cancel",
  async (params, { rejectWithValue }) => {
    const { id, ...rest } = params;
    return await callService({
      url: `${endpoints.outboundUrl.cancelOutbound}/${id}`,
      errorCallback: rejectWithValue,
    }).post(rest);
  },
);
