"use client";

import { useState } from "react";
import { createAxiosInstance } from "./axios-config";
import { useAppDispatch } from "@/store/store";
import { setUserState } from "@/store/slices/userSlice";
import Cookies from "js-cookie"; // Importar js-cookie

const axios = createAxiosInstance();

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/users/sign-in", { email, password });
      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;

      const userState = {
        email: response.data.email,
        role: response.data.role,
      };

      dispatch(setUserState(userState));

      // Guardar los tokens en cookies
      Cookies.set("accessToken", accessToken, { expires: 7 }); // Cookies que expiran en 7 días
      Cookies.set("refreshToken", refreshToken, { expires: 30 }); // Expira en 30 días

      // Establecer el header Authorization con el token de acceso
      axios.defaults.headers["Authorization"] = `Bearer ${accessToken}`;

      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    password_confirmation: string,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/users/sign-up", {
        email,
        password,
        password_confirmation,
      });
      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;

      const userState = {
        email: response.data.email,
        role: response.data.role,
      };

      dispatch(setUserState(userState));

      // Guardar los tokens en cookies
      Cookies.set("accessToken", accessToken, { expires: 7 });
      Cookies.set("refreshToken", refreshToken, { expires: 30 });

      axios.defaults.headers["Authorization"] = `Bearer ${accessToken}`;

      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/users/verify-token");
      return response.data.authenticated;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const passwordRecovery = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/users/password-recovery", { email });
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const passwordReset = async (
    password: string,
    password_confirmation: string,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put("/users/password-reset", {
        password,
        password_confirmation,
      });
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    passwordRecovery,
    passwordReset,
    isAuthenticated,
    loading,
    error,
  };
};

export default useAuth;
