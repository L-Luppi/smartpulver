import { configureStore } from "@reduxjs/toolkit";
import aircraftReducer from "./aircraftSlice";
import farmerReducer from "./farmerSlice";
import areaReducer from "./areaSlice";
import plotReducer from "./plotSlice";

export const store = configureStore({
  reducer: {
    aircrafts: aircraftReducer,
    farmers: farmerReducer,
    areas: areaReducer,
    plots: plotReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;