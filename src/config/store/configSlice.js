import { createSlice } from "@reduxjs/toolkit";

export const configSlice = createSlice({
  name: "config",
  initialState: {
    locale: localStorage.getItem("locale") || "en-US",
    logged: false,
  },
  reducers: {
    setLocale: (state, action) => {
      state.locale = action.payload;
    },
    setLogged: (state, action) => {
      state.logged = action.payload;
    },
  },
});

export const { setLocale, setLogged } = configSlice.actions;
