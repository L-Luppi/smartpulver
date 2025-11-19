import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Tipagem (igual à usada no PlotTable)
export interface Plot {
  id: string;
  nome: string;
  nomeArea: string;
  area: string;
  latitude: number | null;
  longitude: number | null;
  mapeado: string;
}

// Estado inicial
interface PlotState {
  plots: Plot[];
  loading: boolean;
  error: string | null;
}

const initialState: PlotState = {
  plots: [],
  loading: false,
  error: null,
};

// --- Thunks ----

export const fetchPlots = createAsyncThunk(
  "plots/fetchPlots",
  async () => {
    const { data } = await axios.get("/api/plots");
    return data as Plot[];
  }
);

export const createPlot = createAsyncThunk(
  "plots/createPlot",
  async (plot: Omit<Plot, "id">) => {
    const { data } = await axios.post("/api/plots", plot);
    return data as Plot;
  }
);

export const updatePlot = createAsyncThunk(
  "plots/updatePlot",
  async (plot: Plot) => {
    const { data } = await axios.put(`/api/plots/${plot.id}`, plot);
    return data as Plot;
  }
);

export const deletePlot = createAsyncThunk(
  "plots/deletePlot",
  async (id: string) => {
    await axios.delete(`/api/plots/${id}`);
    return id;
  }
);

// Slice
const plotSlice = createSlice({
  name: "plots",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchPlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlots.fulfilled, (state, action: PayloadAction<Plot[]>) => {
        state.loading = false;
        state.plots = action.payload;
      })
      .addCase(fetchPlots.rejected, (state) => {
        state.loading = false;
        state.error = "Erro ao carregar plots";
      })

      // create
      .addCase(createPlot.fulfilled, (state, action: PayloadAction<Plot>) => {
        state.plots.push(action.payload);
      })

      // update
      .addCase(updatePlot.fulfilled, (state, action: PayloadAction<Plot>) => {
        const index = state.plots.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.plots[index] = action.payload;
      })

      // delete
      .addCase(deletePlot.fulfilled, (state, action: PayloadAction<string>) => {
        state.plots = state.plots.filter((p) => p.id !== action.payload);
      });
  },
});

export default plotSlice.reducer;
