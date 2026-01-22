import { createSlice } from "@reduxjs/toolkit";
import { addKeyDto } from "@dto";
import {
  availableProductListAction,
  checkProductAvailabilityAction,
  checkBranchLimitAction,
  createOutboundAction,
  listOutboundsAction,
} from "./thunks";

export const outboundSlice = createSlice({
  name: "outbound",
  initialState: {
    isLoading: false,
    availableProductList: [],
    
    availabilityResult: null,
    availabilityLoading: false,
    
    limitCheck: null,
    limitLoading: false,
    
    creatingOutbound: false,
    outboundCreated: null,
    
    outboundsList: [],
    outboundsLoading: false,
    
    filters: {},
    page: 0,
    totalPages: 0,
  },
  reducers: {
    clearAvailableProduct: (state) => {
      state.availableProductList = [];
    },
    clearAvailabilityResult: (state) => {
      state.availabilityResult = null;
    },
    clearLimitCheck: (state) => {
      state.limitCheck = null;
    },
    clearOutboundCreated: (state) => {
      state.outboundCreated = null;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    resetOutboundState: (state) => {
      return {
        filters: state.filters,
      };
    },
  },
  extraReducers: (builder) => {
    /** PRODUCTOS DISPONIBLES */
    builder.addCase(availableProductListAction.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(availableProductListAction.rejected, (state) => {
      state.isLoading = false;
      state.availableProductList = [];
    });
    builder.addCase(availableProductListAction.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.availableProductList = addKeyDto.addKey(payload.data || []);
    });

    /** VERIFICAR DISPONIBILIDAD */
    builder.addCase(checkProductAvailabilityAction.pending, (state) => {
      state.availabilityLoading = true;
      state.availabilityResult = null;
    });
    builder.addCase(checkProductAvailabilityAction.rejected, (state) => {
      state.availabilityLoading = false;
      state.availabilityResult = null;
    });
    builder.addCase(checkProductAvailabilityAction.fulfilled, (state, { payload }) => {
      state.availabilityLoading = false;
      state.availabilityResult = payload.data;
    });

    /** VERIFICAR LÍMITE DE SUCURSAL */
    builder.addCase(checkBranchLimitAction.pending, (state) => {
      state.limitLoading = true;
      state.limitCheck = null;
    });
    builder.addCase(checkBranchLimitAction.rejected, (state) => {
      state.limitLoading = false;
      state.limitCheck = null;
    });
    builder.addCase(checkBranchLimitAction.fulfilled, (state, { payload }) => {
      state.limitLoading = false;
      state.limitCheck = payload.data;
    });

    /** CREAR SALIDA */
    builder.addCase(createOutboundAction.pending, (state) => {
      state.creatingOutbound = true;
      state.outboundCreated = null;
    });
    builder.addCase(createOutboundAction.rejected, (state) => {
      state.creatingOutbound = false;
    });
    builder.addCase(createOutboundAction.fulfilled, (state, { payload }) => {
      state.creatingOutbound = false;
      state.outboundCreated = payload.data;
      // Limpiar datos temporales después de crear
      state.availabilityResult = null;
      state.limitCheck = null;
    });

    /** LISTAR SALIDAS */
    builder.addCase(listOutboundsAction.pending, (state) => {
      state.outboundsLoading = true;
    });
    builder.addCase(listOutboundsAction.rejected, (state) => {
      state.outboundsLoading = false;
      state.outboundsList = [];
    });
    builder.addCase(listOutboundsAction.fulfilled, (state, { payload }) => {
      state.outboundsLoading = false;
      state.outboundsList = addKeyDto.addKey(payload.data || []);
      state.totalPages = payload.totalPages || 0;
    });
  },
});

export const {
  clearAvailableProduct,
  clearAvailabilityResult,
  clearLimitCheck,
  clearOutboundCreated,
  setFilters,
  resetOutboundState,
} = outboundSlice.actions;

export default outboundSlice.reducer;