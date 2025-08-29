import { configureStore } from "@reduxjs/toolkit";
import aircraftReducer from "./aircraftSlice";

export const store = configureStore({
  reducer: {
    aircrafts: aircraftReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;