import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "../services/getAccessToken";

export interface Farmer {
  id: string;
  nome: string;
  telefone: string;
  areas: number;
  servicos: string[];
  ativo: boolean;
}

interface FarmerState {
  items: Farmer[];
  page: number;
  rowsPerPage: number;
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: FarmerState = {
  items: [],
  page: 0,
  rowsPerPage: 5,
  total: 0,
  loading: false,
  error: null,
};

const BASE_URL = import.meta.env.VITE_BASE_URL;

// 🔹 Helper com token
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = AuthService.getAccessToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Erro ${res.status}: ${errorText}`);
  }

  return res.json();
}

// ======================================================
// 🔹 LISTAR produtores (com paginação)
// ======================================================
export const fetchFarmers = createAsyncThunk(
  "farmers/fetch",
  async ({ page, rowsPerPage }: { page: number; rowsPerPage: number }) => {
    return fetchWithAuth(
      `${BASE_URL}/farmers?page=${page}&limit=${rowsPerPage}`
    );
  }
);

// ======================================================
// 🔹 CRIAR produtor
// ======================================================
export const addFarmerAsync = createAsyncThunk(
  "farmers/add",
  async (farmer: Omit<Farmer, "id">) => {
    return fetchWithAuth(`${BASE_URL}/farmers`, {
      method: "POST",
      body: JSON.stringify(farmer),
    });
  }
);

// ======================================================
// 🔹 EDITAR produtor
// ======================================================
export const editFarmerAsync = createAsyncThunk(
  "farmers/edit",
  async (farmer: Farmer) => {
    return fetchWithAuth(`${BASE_URL}/farmers/${farmer.id}`, {
      method: "PUT",
      body: JSON.stringify(farmer),
    });
  }
);

// ======================================================
// 🔹 EXCLUIR produtor
// ======================================================
export const deleteFarmerAsync = createAsyncThunk(
  "farmers/delete",
  async (id: string) => {
    await fetchWithAuth(`${BASE_URL}/farmers/${id}`, { method: "DELETE" });
    return id;
  }
);

// ======================================================
// 🔹 SLICE PRINCIPAL
// ======================================================
const farmerSlice = createSlice({
  name: "farmers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // LISTAR
      .addCase(fetchFarmers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFarmers.fulfilled, (state, action) => {
        state.items = action.payload.data;
        state.total = action.payload.total;
        state.loading = false;
      })
      .addCase(fetchFarmers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erro ao carregar produtores";
      })

      // CRIAR
      .addCase(addFarmerAsync.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // EDITAR
      .addCase(editFarmerAsync.fulfilled, (state, action) => {
        const index = state.items.findIndex((f) => f.id === action.payload.id);
        if (index >= 0) state.items[index] = action.payload;
      })

      // EXCLUIR
      .addCase(deleteFarmerAsync.fulfilled, (state, action) => {
        state.items = state.items.filter((f) => f.id !== action.payload);
      });
  },
});

export default farmerSlice.reducer;
