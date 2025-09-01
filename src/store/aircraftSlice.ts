import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import getAccessToken from "../services/getAccessToken";

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

// baseURL do backend (ajuste conforme seu projeto)
const BASE_URL = import.meta.env.VITE_BASE_URL; 
// ou: process.env.REACT_APP_API_BASE_URL (se não usa Vite)

// 🔹 Listar aeronaves (com paginação)
export const fetchAircrafts = createAsyncThunk(
  "aircrafts/fetch",
  async ({ page, rowsPerPage }: { page: number; rowsPerPage: number }) => {
    const token = await getAccessToken(); // 🔑 pega o token do Cognito

    const res = await fetch(`${BASE_URL}/drones?page=${page}&limit=${rowsPerPage}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // 🔑 envia token no header
      },
    });

    if (!res.ok) {
      throw new Error(`Erro ${res.status} ao carregar aeronaves`);
    }

    return res.json();
  }
);

// 🔹 Criar aeronave
export const addAircraftAsync = createAsyncThunk(
  "aircrafts/add",
  async (aircraft: Omit<Aircraft, "id">) => {
    const res = await fetch(`${BASE_URL}/drones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aircraft),
    });
    if (!res.ok) throw new Error("Erro ao adicionar aeronave");
    return res.json() as Promise<Aircraft>;
  }
);

// 🔹 Editar aeronave
export const editAircraftAsync = createAsyncThunk(
  "aircrafts/edit",
  async (aircraft: Aircraft) => {
    const res = await fetch(`${BASE_URL}/drones/${aircraft.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aircraft),
    });
    if (!res.ok) throw new Error("Erro ao editar aeronave");
    return res.json() as Promise<Aircraft>;
  }
);

// 🔹 Excluir aeronave
export const deleteAircraftAsync = createAsyncThunk(
  "aircrafts/delete",
  async (id: string) => {
    const res = await fetch(`${BASE_URL}/drones/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erro ao excluir aeronave");
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
