import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Category = {
  id: number;
  name: string;
  slug: string;
  image: string;
};

interface CategoriesState {
  categories: Category[];
  currentCategory: Category | null; // Add this for handling single category
}

const initialState: CategoriesState = {
  categories: [],
  currentCategory: null, // Initialize to null
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
    },
    setCurrentCategory(state, action: PayloadAction<Category | null>) {
      state.currentCategory = action.payload;
    },
    deleteCategory(state, action: PayloadAction<number>) {
      state.categories = state.categories.filter(
        (category) => category.id !== action.payload,
      );
    },
  },
});

export const { setCategories, setCurrentCategory, deleteCategory } =
  categoriesSlice.actions;
export const categoryReducer = categoriesSlice.reducer;
