import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IOrderState {}

const initialState: IOrderState = {};

export const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrderState: (state, action: PayloadAction<Partial<IOrderState>>) => {
      return { ...state, ...action.payload };
    },
    clearOrderState: (state) => {},
  },
});

export const { setOrderState, clearOrderState } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
