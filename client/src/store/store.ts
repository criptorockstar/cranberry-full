import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { userReducer } from "@/store/slices/userSlice";
import { categoryReducer } from "@/store/slices/categorySlice";
import { productReducer } from "./slices/productSlice";
import { orderReducer } from "./slices/orderSlice";
import { colorReducer } from "./slices/colorSlice";
import { sizeReducer } from "./slices/sizeSlice";
import { drawerReducer } from "./slices/drawerSlice";

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["role", "email"],
};

const drawerPersistConfig = {
  key: "drawer",
  storage,
  whitelist: ["isOpen"],
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedDrawerReducer = persistReducer(
  drawerPersistConfig,
  drawerReducer,
);

const rootReducer = combineReducers({
  user: persistedUserReducer,
  categories: categoryReducer,
  products: productReducer,
  orders: orderReducer,
  colors: colorReducer,
  sizes: sizeReducer,
  drawer: persistedDrawerReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
