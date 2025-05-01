"use client";

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import teamReducer from "./teamSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    team: teamReducer,
  },
});

export default store;
