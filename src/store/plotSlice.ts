import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

export interface Plot {
  id: string;
  nome: string;
  nomeArea: string;
  area: string;
  latitude: number | null;
  longitude: number | null;
  mapeado: string;
}

interface PlotsState {
  plots: Plot[];
  loading: boolean;
  error: string | null;
}

const initialState: PlotsState = {
  plots: [],
  loading: false,
  error: null,
};

/* ============================
   Thunks (coloque API depois)
   ============================ */

// Buscar todos os talhões
export const fetchPlots = createAsyncThunk("plots/fetchAll", async () => {
  // coloque sua chamada real depois
  return [] as Plot[];
});

// Criar talhão
export const createPlot = createAsyncThunk(
  "plots/create",
  async (data: Omit<Plot, "id">) => {
    return {
      ...data,
      id: crypto.randomUUID(),
    } as Plot;
  }
);

// Atualizar talhão
export const updatePlot = createAsyncThunk(
  "plots/update",
  async (plot: Plot) => {
    return plot;
  }
);

// Remover talhão
export const deletePlot = createAsyncThunk("plots/delete", async (id: string) => {
  return id;
});

/* ============================
   Slice
   ============================ */

const plotsSlice = createSlice({
  name: "plots",
  initialState,
  reducers: {
    clearPlots(state) {
      state.plots = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchPlots.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPlots.fulfilled, (state, action: PayloadAction<Plot[]>) => {
        state.loading = false;
        state.plots = action.payload;
      })
      .addCase(fetchPlots.rejected, (state) => {
        state.loading = false;
        state.error = "Erro ao carregar plots";
      })

      // Create
      .addCase(createPlot.fulfilled, (state, action: PayloadAction<Plot>) => {
        state.plots.push(action.payload);
      })

      // Update
      .addCase(updatePlot.fulfilled, (state, action: PayloadAction<Plot>) => {
        const index = state.plots.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.plots[index] = action.payload;
      })

      // Delete
      .addCase(deletePlot.fulfilled, (state, action: PayloadAction<string>) => {
        state.plots = state.plots.filter((p) => p.id !== action.payload);
      });
  },
});

export const { clearPlots } = plotsSlice.actions;

export default plotsSlice.reducer;
