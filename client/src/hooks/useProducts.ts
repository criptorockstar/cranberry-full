import { useState } from "react";
import { useAxiosInstance } from "./axios-config";
import { deleteCategory as deleteCategoryAction } from "../store/slices/categorySlice";
import { useAppDispatch } from "@/store/store";

const axios = useAxiosInstance();

const useProducts = () => {
  const dispatch = useAppDispatch();
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

  const deleteProduct = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`/products/product/${id}`);
      dispatch(deleteCategoryAction(id));
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editProduct = async (id: number, data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/products/product/${id}`, data);
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
    deleteProduct,
    editProduct,
    loading,
    error,
  };
};

export default useProducts;
