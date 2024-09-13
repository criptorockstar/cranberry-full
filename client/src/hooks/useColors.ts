import { useState } from "react";
import { useAxiosInstance } from "./axios-config";

const axios = useAxiosInstance();

const useColors = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getColors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/products/colors");
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getColors,
    loading,
    error,
  };
};

export default useColors;
