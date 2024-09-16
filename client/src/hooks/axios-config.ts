import axios from "axios";
import Cookies from "js-cookie";
import { clearUserState } from "@/store/slices/userSlice";
import { store } from "@/store/store";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.cranberrymayorista.com";

// Instancia para solicitudes autenticadas
const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: API_URL,
  });

  // Interceptor para añadir el token de acceso
  instance.interceptors.request.use(
    (config) => {
      if (typeof window !== "undefined") {
        const accessToken = Cookies.get("accessToken");

        if (accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
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
        Cookies.remove("accessToken");

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
