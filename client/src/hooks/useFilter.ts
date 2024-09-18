import { useState } from "react";
import { useAxiosInstance } from "./axios-config";

const axios = useAxiosInstance();

const useFilter = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProductByFilters = async (filters: []) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`/products/by-filters`, {
        filters,
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
    getProductByFilters,
    loading,
    error,
  };
};

export default useFilter;
