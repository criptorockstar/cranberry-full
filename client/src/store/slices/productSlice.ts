import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define interfaces
export interface Image {
  id: number;
  url: string;
}

export interface Color {
  id: number;
  name: string;
  code: string;
}

export interface Size {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  stock: number;
  price: number;
  offer: number;
  quantity: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  images: Image[];
  colors: Color[];
  sizes: Size[];
  categories: Category[];
}

export interface IProductState {
  products: Product[];
}

const initialState: IProductState = {
  products: [],
};

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    deleteProduct(state, action: PayloadAction<number>) {
      state.products = state.products.filter(
        (product) => product.id !== action.payload,
      );
    },
    clearProductState: (state) => {
      state.products = [];
    },
  },
});

// Selector para obtener el producto basado en el slug
export const getCurrentProduct = (
  state: IProductState,
  slug: string,
): Product | undefined => {
  return state.products.find((product) => product.slug === slug);
};

export const { setProducts, deleteProduct, clearProductState } =
  productSlice.actions;
export const productReducer = productSlice.reducer;
