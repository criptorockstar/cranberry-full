import { useState } from "react";
import { useAxiosInstance } from "./axios-config";

const axios = useAxiosInstance();

const useSizes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSizes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/products/sizes");
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSize = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/products/sizes/size/${id}`);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getSizes,
    getSize,
    loading,
    error,
  };
};

export default useSizes;
