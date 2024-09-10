import axios from "axios";
import Cookies from "js-cookie";
import { clearUserState } from "@/store/slices/userSlice";
import { store } from "@/store/store";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Instancia para solicitudes autenticadas
const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: API_URL,
  });

  // Interceptor para añadir el token de acceso
  instance.interceptors.request.use(
    (config) => {
      if (typeof window !== "undefined") {
        const access_token = Cookies.get("access_token");

        if (access_token) {
          config.headers["Authorization"] = `Bearer ${access_token}`;
        }
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  // Interceptor para manejar respuestas
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Si la respuesta es 401 (no autorizado), eliminar los tokens y limpiar el estado del usuario
      if (error.response?.status === 401) {
        Cookies.remove("access_token");

        // Despachar la acción para limpiar el estado del usuario en Redux
        store.dispatch(clearUserState());
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

// Instancia para solicitudes públicas (sin autenticación)
const useAxiosInstance = () => {
  return axios.create({
    baseURL: API_URL,
  });
};

export { createAxiosInstance, useAxiosInstance };
