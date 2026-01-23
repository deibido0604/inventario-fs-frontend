import { createSlice } from '@reduxjs/toolkit';

export const layoutSlice = createSlice({
  name: 'Layout',
  initialState: {
    notification: {
      show: false,
      message: '',
      description: '',
      placement: '',
      type: '',
      duration: 3,
    },
  },
  reducers: {
    openNotification: (state, action) => {
      state.notification = action.payload;
    },
    closeNotification: (state) => {
      state.notification = {
        show: false,
        message: '',
        description: '',
        placement: '',
        type: '',
      };
    },
  },
});

export const { openNotification, closeNotification } = layoutSlice.actions;
