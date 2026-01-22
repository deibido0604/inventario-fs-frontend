/* eslint-disable react-hooks/rules-of-hooks */
import { useApi } from "@hooks";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { endpoints } from "@utils";

const { callService } = useApi();

// Listar productos disponibles para salida
export const availableProductListAction = createAsyncThunk(
  "availableProduct/list",
  async (params, { rejectWithValue }) => {
    return await callService({
      url: endpoints.outboundUrl.availableProductList,
      errorCallback: rejectWithValue,
    }).get({ params: { branchId: params.branchId } });
  },
);

// Verificar disponibilidad de producto
export const checkProductAvailabilityAction = createAsyncThunk(
  "outbound/checkAvailability",
  async (params, { rejectWithValue }) => {
    return await callService({
      url: endpoints.outboundUrl.checkAvailability,
      errorCallback: rejectWithValue,
    }).post(params);
  },
);

// Verificar límite de sucursal
export const checkBranchLimitAction = createAsyncThunk(
  "outbound/checkBranchLimit",
  async (params, { rejectWithValue }) => {
    return await callService({
      url: endpoints.outboundUrl.checkBranchLimit,
      errorCallback: rejectWithValue,
    }).get({ params });
  },
);

// Crear salida
export const createOutboundAction = createAsyncThunk(
  "outbound/create",
  async (params, { rejectWithValue }) => {
    return await callService({
      url: endpoints.outboundUrl.createOutbound,
      errorCallback: rejectWithValue,
    }).post(params);
  },
);

// Listar salidas
export const listOutboundsAction = createAsyncThunk(
  "outbound/list",
  async (params, { rejectWithValue }) => {
    return await callService({
      url: endpoints.outboundUrl.listOutbounds,
      errorCallback: rejectWithValue,
    }).get({ params });
  },
);

// Recibir salida
export const receiveOutboundAction = createAsyncThunk(
  "outbound/receive",
  async (params, { rejectWithValue }) => {
    return await callService({
      url: endpoints.outboundUrl.receiveOutbound,
      errorCallback: rejectWithValue,
    }).post(params);
  },
);

// Obtener detalles de salida
export const getOutboundDetailsAction = createAsyncThunk(
  "outbound/details",
  async (params, { rejectWithValue }) => {
    return await callService({
      url: endpoints.outboundUrl.getOutboundDetails,
      errorCallback: rejectWithValue,
    }).get({ params });
  },
);
