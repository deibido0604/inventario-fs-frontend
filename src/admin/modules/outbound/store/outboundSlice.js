import { createSlice } from "@reduxjs/toolkit";
import { addKeyDto } from "@dto";
import {
  availableProductListAction,
  checkProductAvailabilityAction,
  checkBranchLimitAction,
  createOutboundAction,
  listOutboundsAction,
  receiveOutboundAction,
  getOutboundDetailsAction,
  getOutboundStatsAction,
  cancelOutboundAction,
} from "./thunks";

const initialState = {
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

  receivingOutbound: false,
  outboundReceived: null,

  outboundDetails: null,
  detailsLoading: false,

  stats: null,
  statsLoading: false,

  cancellingOutbound: false,
  outboundCancelled: null,

  filters: {},
  page: 0,
  totalPages: 0,
  totalItems: 0,
};

export const outboundSlice = createSlice({
  name: "outbound",
  initialState,
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
    clearOutboundReceived: (state) => {
      state.outboundReceived = null;
    },
    clearOutboundDetails: (state) => {
      state.outboundDetails = null;
    },
    clearOutboundCancelled: (state) => {
      state.outboundCancelled = null;
    },
    clearStats: (state) => {
      state.stats = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    resetOutboundState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(availableProductListAction.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(availableProductListAction.rejected, (state) => {
      state.isLoading = false;
      state.availableProductList = [];
    });
    builder.addCase(
      availableProductListAction.fulfilled,
      (state, { payload }) => {
        state.isLoading = false;
        state.availableProductList = addKeyDto.addKey(payload.data || []);
      },
    );

    builder.addCase(checkProductAvailabilityAction.pending, (state) => {
      state.availabilityLoading = true;
      state.availabilityResult = null;
    });
    builder.addCase(checkProductAvailabilityAction.rejected, (state) => {
      state.availabilityLoading = false;
      state.availabilityResult = null;
    });
    builder.addCase(
      checkProductAvailabilityAction.fulfilled,
      (state, { payload }) => {
        state.availabilityLoading = false;
        state.availabilityResult = payload.data;
      },
    );

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
      state.availabilityResult = null;
      state.limitCheck = null;
    });

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
      state.totalItems = payload.total || payload.data?.length || 0;
    });

    builder.addCase(receiveOutboundAction.pending, (state) => {
      state.receivingOutbound = true;
      state.outboundReceived = null;
    });
    builder.addCase(receiveOutboundAction.rejected, (state) => {
      state.receivingOutbound = false;
    });
    builder.addCase(receiveOutboundAction.fulfilled, (state, { payload }) => {
      state.receivingOutbound = false;
      state.outboundReceived = payload.data;
      if (payload.data?._id) {
        const index = state.outboundsList.findIndex(
          (item) => item._id === payload.data._id,
        );
        if (index !== -1) {
          state.outboundsList[index] = {
            ...state.outboundsList[index],
            status: "Recibido en sucursal",
            received_by: payload.data.received_by,
            received_date: payload.data.received_date,
          };
        }
      }
    });

    builder.addCase(getOutboundDetailsAction.pending, (state) => {
      state.detailsLoading = true;
      state.outboundDetails = null;
    });
    builder.addCase(getOutboundDetailsAction.rejected, (state) => {
      state.detailsLoading = false;
    });
    builder.addCase(
      getOutboundDetailsAction.fulfilled,
      (state, { payload }) => {
        state.detailsLoading = false;
        state.outboundDetails = payload.data;
      },
    );

    builder.addCase(getOutboundStatsAction.pending, (state) => {
      state.statsLoading = true;
      state.stats = null;
    });
    builder.addCase(getOutboundStatsAction.rejected, (state) => {
      state.statsLoading = false;
    });
    builder.addCase(getOutboundStatsAction.fulfilled, (state, { payload }) => {
      state.statsLoading = false;
      state.stats = payload.data;
    });

    builder.addCase(cancelOutboundAction.pending, (state) => {
      state.cancellingOutbound = true;
      state.outboundCancelled = null;
    });
    builder.addCase(cancelOutboundAction.rejected, (state) => {
      state.cancellingOutbound = false;
    });
    builder.addCase(cancelOutboundAction.fulfilled, (state, { payload }) => {
      state.cancellingOutbound = false;
      state.outboundCancelled = payload.data;
      if (payload.data?._id) {
        const index = state.outboundsList.findIndex(
          (item) => item._id === payload.data._id,
        );
        if (index !== -1) {
          state.outboundsList[index] = {
            ...state.outboundsList[index],
            status: "Cancelada",
          };
        }
      }
    });
  },
});

export const {
  clearAvailableProduct,
  clearAvailabilityResult,
  clearLimitCheck,
  clearOutboundCreated,
  clearOutboundReceived,
  clearOutboundDetails,
  clearOutboundCancelled,
  clearStats,
  setFilters,
  clearFilters,
  resetOutboundState,
} = outboundSlice.actions;

export default outboundSlice.reducer;
