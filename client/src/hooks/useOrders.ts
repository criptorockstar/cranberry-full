import { useState } from "react";
import { useAxiosInstance } from "./axios-config";
import { deleteCategory as deleteCategoryAction } from "../store/slices/categorySlice";
import { useAppDispatch } from "@/store/store";

const axios = useAxiosInstance();

const useOrders = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/cart/orders");
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`/cart/order/${id}`);
      dispatch(deleteCategoryAction(id));
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editOrder = async (id: number, data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/cart/order/${id}`, data);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getOrders,
    deleteOrder,
    editOrder,
    loading,
    error,
  };
};

export default useOrders;
