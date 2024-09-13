import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define la interfaz Size con las propiedades id y name
export interface Size {
  id: number;
  name: string;
}

// Define el estado inicial de ISizeState
export interface ISizeState {
  sizes: Size[];
}

const initialState: ISizeState = {
  sizes: [],
};

export const sizeSlice = createSlice({
  name: "size",
  initialState,
  reducers: {
    // Actualiza el estado con una parte del payload
    setSizeState: (state, action: PayloadAction<Partial<ISizeState>>) => {
      return { ...state, ...action.payload };
    },
    // Establece la lista de tamaños
    setSizes: (state, action: PayloadAction<Size[]>) => {
      state.sizes = action.payload;
    },
    // Limpia el estado de tamaños
    clearSizeState: (state) => {
      state.sizes = [];
    },
  },
});

// Exporta las acciones y el reductor
export const { setSizeState, setSizes, clearSizeState } = sizeSlice.actions;
export const sizeReducer = sizeSlice.reducer;
