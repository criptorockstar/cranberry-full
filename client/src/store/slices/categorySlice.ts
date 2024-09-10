import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Category = {
  id: number;
  name: string;
  slug: string;
  image: string;
};

interface CategoriesState {
  categories: Category[];
}

const initialState: CategoriesState = {
  categories: [],
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
    },
    deleteCategory(state, action: PayloadAction<number>) {
      state.categories = state.categories.filter(
        (category) => category.id !== action.payload,
      );
    },
  },
});

export const { setCategories, deleteCategory } = categoriesSlice.actions;
export const categoryReducer = categoriesSlice.reducer;
