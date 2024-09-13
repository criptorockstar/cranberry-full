import { useState } from "react";
import { createAxiosInstance } from "./axios-config";
import { deleteCategory as deleteCategoryAction } from "@/store/slices/categorySlice";
import { deleteProduct as deleteProductAction } from "@/store/slices/productSlice";
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

  const deleteProduct = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`/products/delete-product/${id}`);
      dispatch(deleteProductAction(id));
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

  const updateProduct = async (id: number, data: any) => {
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

  const createProduct = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      console.log(data);
      const response = await axios.post("/products/create-product", data);
      return response.data;
    } catch (err: any) {
      setError("Error al crear el producto");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("/products/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      return response.data; // Return the data if needed
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error uploading file";
      setError(errorMessage);
      console.error("Error uploading file:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createCategory,
    deleteCategory,
    updateCategory,
    createProduct,
    deleteProduct,
    updateProduct,
    uploadImage,
    loading,
    error,
  };
};

export default useAdmin;
