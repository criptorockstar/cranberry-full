import { useState } from "react";
import { useAxiosInstance } from "./axios-config";

const axios = useAxiosInstance();

const useProducts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/products");
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProduct = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/products/product/${id}`);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getProducts,
    getProduct,
    loading,
    error,
  };
};

export default useProducts;
