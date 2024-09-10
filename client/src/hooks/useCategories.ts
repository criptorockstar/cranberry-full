import { useState } from "react";
import { useAxiosInstance } from "./axios-config";
import { deleteCategory as deleteCategoryAction } from "../store/slices/categorySlice";
import { useAppDispatch } from "@/store/store";

const axios = useAxiosInstance();

const useCategories = () => {
  const dispatch = useAppDispatch();
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

  const deleteCategory = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(
        `/products/categories/category/${id}`,
      );
      dispatch(deleteCategoryAction(id));
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

  const editCategory = async (id: number, data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `/products/categories/category/${id}`,
        data,
      );
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
    deleteCategory,
    editCategory,
    loading,
    error,
  };
};

export default useCategories;
