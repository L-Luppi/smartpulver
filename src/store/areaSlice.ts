import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";


export interface Area {
  id: string;
  nome: string;
  nomeComum: string;
  responsavel: string;
  cidade: string;
  estado: string;

  latitude: number;
  longitude: number;

  talhoes: number;
  total: number;
}


interface AreaState {
  areas: Area[];
  loading: boolean;
  error: string | null;
}

const initialState: AreaState = {
  areas: [],
  loading: false,
  error: null,
};

/* ============================
   Thunks (caso use API depois)
   ============================ */

// Buscar todas as áreas
export const fetchAreas = createAsyncThunk("areas/fetchAll", async () => {
  // coloque a chamada de API real aqui
  return [] as Area[];
});

// Criar nova área
export const createArea = createAsyncThunk(
  "areas/create",
  async (data: Omit<Area, "id">) => {
    // simulação
    return {
      ...data,
      id: crypto.randomUUID(),
    } as Area;
  }
);

// Atualizar área
export const updateArea = createAsyncThunk(
  "areas/update",
  async (area: Area) => {
    return area;
  }
);

// Remover área
export const deleteArea = createAsyncThunk(
  "areas/delete",
  async (id: string) => id
);

/* ============================
   Slice
   ============================ */

const areaSlice = createSlice({
  name: "areas",
  initialState,
  reducers: {
    clearAreas(state) {
      state.areas = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchAreas.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAreas.fulfilled, (state, action: PayloadAction<Area[]>) => {
        state.loading = false;
        state.areas = action.payload;
      })
      .addCase(fetchAreas.rejected, (state) => {
        state.loading = false;
        state.error = "Erro ao carregar áreas";
      })

      // Create
      .addCase(createArea.fulfilled, (state, action: PayloadAction<Area>) => {
        state.areas.push(action.payload);
      })

      // Update
      .addCase(updateArea.fulfilled, (state, action: PayloadAction<Area>) => {
        const index = state.areas.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) state.areas[index] = action.payload;
      })

      // Delete
      .addCase(deleteArea.fulfilled, (state, action: PayloadAction<string>) => {
        state.areas = state.areas.filter((a) => a.id !== action.payload);
      });
  },
});

export const { clearAreas } = areaSlice.actions;

export default areaSlice.reducer;
