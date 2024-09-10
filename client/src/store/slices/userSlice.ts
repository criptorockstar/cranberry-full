import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUserState {
  email?: string;
  role?: string;
}

const initialState: IUserState = {
  email: undefined,
  role: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserState: (state, action: PayloadAction<Partial<IUserState>>) => {
      return { ...state, ...action.payload };
    },
    setEmailState: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    clearUserState: (state) => {
      state.email = undefined;
      state.role = undefined;
    },
  },
});

export const { setUserState, setEmailState, clearUserState } =
  userSlice.actions;
export const userReducer = userSlice.reducer;
