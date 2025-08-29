// src/store/aircraftSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Aircraft {
  id: string;
  prefix: string;
  model: string;
  manufacturer: string;
  year: number;
  type: string;
}

interface AircraftState {
  items: Aircraft[];
  page: number;
  rowsPerPage: number;
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: AircraftState = {
  items: [],
  page: 0,
  rowsPerPage: 5,
  total: 0,
  loading: false,
  error: null,
};

// 🔹 Mock async (simula API real com paginação)
export const fetchAircrafts = createAsyncThunk(
  "aircrafts/fetch",
  async ({ page, rowsPerPage }: { page: number; rowsPerPage: number }) => {
    return new Promise<{ data: Aircraft[]; total: number }>((resolve) => {
      setTimeout(() => {
        const all: Aircraft[] = [
          { id: "1", prefix: "PR-AAA", model: "Cessna 172", manufacturer: "Cessna", year: 2010, type: "Monomotor" },
          { id: "2", prefix: "PR-BBB", model: "King Air", manufacturer: "Beechcraft", year: 2015, type: "Turboélice" },
          { id: "3", prefix: "PR-CCC", model: "Phenom 100", manufacturer: "Embraer", year: 2018, type: "Jato leve" },
          { id: "4", prefix: "PR-DDD", model: "Piper PA-28", manufacturer: "Piper", year: 2005, type: "Monomotor" },
          { id: "5", prefix: "PR-EEE", model: "Airbus A320", manufacturer: "Airbus", year: 2020, type: "Jato comercial" },
          { id: "6", prefix: "PR-FFF", model: "Boeing 737", manufacturer: "Boeing", year: 2019, type: "Jato comercial" },
        ];

        const start = page * rowsPerPage;
        const end = start + rowsPerPage;
        const paginated = all.slice(start, end);

        resolve({
          data: paginated,
          total: all.length,
        });
      }, 800); // simula 800ms de requisição
    });
  }
);

const aircraftSlice = createSlice({
  name: "aircrafts",
  initialState,
  reducers: {
    addAircraft: (state, action: PayloadAction<Aircraft>) => {
      state.items.push(action.payload);
    },
    editAircraft: (state, action: PayloadAction<Aircraft>) => {
      const index = state.items.findIndex((a) => a.id === action.payload.id);
      if (index >= 0) state.items[index] = action.payload;
    },
    deleteAircraft: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((a) => a.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAircrafts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAircrafts.fulfilled, (state, action) => {
        state.items = action.payload.data;
        state.total = action.payload.total;
        state.loading = false;
      })
      .addCase(fetchAircrafts.rejected, (state) => {
        state.error = "Erro ao carregar aeronaves";
        state.loading = false;
      });
  },
});

export const { addAircraft, editAircraft, deleteAircraft } = aircraftSlice.actions;
export default aircraftSlice.reducer;
