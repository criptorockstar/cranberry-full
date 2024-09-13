import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Color {
  id: number;
  name: string;
  code: string;
}

export interface IColorState {
  colors: Color[];
}

const initialState: IColorState = {
  colors: [],
};

export const colorSlice = createSlice({
  name: "color",
  initialState,
  reducers: {
    setColorState: (state, action: PayloadAction<Partial<IColorState>>) => {
      return { ...state, ...action.payload };
    },
    setColors: (state, action: PayloadAction<Color[]>) => {
      state.colors = action.payload;
    },
    clearColorState: (state) => {
      state.colors = [];
    },
  },
});

export const { setColorState, setColors, clearColorState } = colorSlice.actions;
export const colorReducer = colorSlice.reducer;
