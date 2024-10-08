import { useState } from "react";
import { useAxiosInstance } from "./axios-config";

const axios = useAxiosInstance();

const useCategories = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/products/categories");
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCategory = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/products/categories/category/${id}`);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getCategories,
    getCategory,
    loading,
    error,
  };
};

export default useCategories;
