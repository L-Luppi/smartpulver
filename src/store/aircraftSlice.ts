import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "../services/getAccessToken";

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

// baseURL do backend (com barra no final no .env)
const BASE_URL = import.meta.env.VITE_BASE_URL; 

// 🔹 Função helper para chamadas autenticadas
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = AuthService.getAccessToken();
  console.log("TOKEN:", token);

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  console.log(headers)
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Erro ${res.status}: ${errorText}`);
  }
  return res.json();
}
// 🔹 Listar aeronaves (com paginação)
export const fetchAircrafts = createAsyncThunk(
  "aircrafts/fetch",
  async ({ page, rowsPerPage }: { page: number; rowsPerPage: number }) => {
    return fetchWithAuth(
      `${BASE_URL}/drones?page=${page}&limit=${rowsPerPage}`
    );
  }
);

// 🔹 Criar aeronave
export const addAircraftAsync = createAsyncThunk(
  "aircrafts/add",
  async (aircraft: Omit<Aircraft, "id">) => {
    return fetchWithAuth(`${BASE_URL}/drones`, {
      method: "POST",
      body: JSON.stringify(aircraft),
    });
  }
);

// 🔹 Editar aeronave
export const editAircraftAsync = createAsyncThunk(
  "aircrafts/edit",
  async (aircraft: Aircraft) => {
    return fetchWithAuth(`${BASE_URL}/drones/${aircraft.id}`, {
      method: "PUT",
      body: JSON.stringify(aircraft),
    });
  }
);

// 🔹 Excluir aeronave
export const deleteAircraftAsync = createAsyncThunk(
  "aircrafts/delete",
  async (id: string) => {
    await fetchWithAuth(`${BASE_URL}/drones/${id}`, { method: "DELETE" });
    return id;
  }
);

const aircraftSlice = createSlice({
  name: "aircrafts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Listar
      .addCase(fetchAircrafts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAircrafts.fulfilled, (state, action) => {
        state.items = action.payload.data;
        state.total = action.payload.total;
        state.loading = false;
      })
      .addCase(fetchAircrafts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erro ao carregar aeronaves";
      })

      // Criar
      .addCase(addAircraftAsync.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // Editar
      .addCase(editAircraftAsync.fulfilled, (state, action) => {
        const index = state.items.findIndex((a) => a.id === action.payload.id);
        if (index >= 0) state.items[index] = action.payload;
      })

      // Excluir
      .addCase(deleteAircraftAsync.fulfilled, (state, action) => {
        state.items = state.items.filter((a) => a.id !== action.payload);
      });
  },
});

export default aircraftSlice.reducer;
