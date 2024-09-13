import { useState } from "react";
import { createAxiosInstance } from "./axios-config";
import { deleteCategory as deleteCategoryAction } from "@/store/slices/categorySlice";
import { useAppDispatch } from "@/store/store";

const axios = createAxiosInstance();

const useAdmin = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCategory = async (name: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "/products/categories/create-category",
        {
          name,
        },
      );
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
        `/products/categories/delete-category/${id}`,
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

  const updateCategory = async (id: number, data: any) => {
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

  const createProduct = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      console.log(data);
      const response = await axios.post("/products/create-product", data);
      return response.data;
    } catch (err: any) {
      setError("Error al crear el producto");
      console.log(err.response.data);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: any) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("/products/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return {
    createCategory,
    deleteCategory,
    updateCategory,
    createProduct,
    uploadImage,
    loading,
    error,
  };
};

export default useAdmin;
