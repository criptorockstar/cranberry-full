"use client";

import React, { useRef, useState } from "react";
import { setCurrentProduct } from "@/store/slices/productSlice";
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import useAdmin from "@/hooks/useAdmin"
import useProducts from "@/hooks/useProducts";
import { Save, Trash2, Star, CirclePlus } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import Select from 'react-select';
import useCategories from "@/hooks/useCategories";
import useColors from "@/hooks/useColors";
import useSizes from "@/hooks/useSizes";

import { setCategories } from "@/store/slices/categorySlice";
import { setColors } from "@/store/slices/colorSlice";
import { setSizes } from "@/store/slices/sizeSlice";
import { Image, Color, Size, Category } from '@/store/slices/productSlice';

interface updateProductFormValues {
  name: string;
  description: string;
  images: File[];
  price: number;
  offer: number;
  quantity: "ilimitado" | "limitado";
  stock: number;
  categories: { value: string, label: string }[];
  colors: string[];
  sizes: string[];
}

export default function EditProduct({ params }: any) {
  const router = useRouter();
  const { updateProduct, uploadImage } = useAdmin();
  const { getProduct } = useProducts();
  const { getColors } = useColors();
  const { getSizes } = useSizes();
  const { getCategories } = useCategories();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentProduct = useAppSelector((state) => state.products.currentProduct);

  const dispatch = useAppDispatch();

  const categories = useAppSelector((state) => state.categories.categories);
  const colors = useAppSelector((state) => state.colors.colors);
  const sizes = useAppSelector((state) => state.sizes.sizes);

  const [images, setImages] = useState<File[]>([]);
  const [imageObject, setImageObject] = useState<string[]>([]); // Cambia 'any' a 'string[]'
  const [imageError, setImageError] = useState<string | null>(null);
  const [colorError, setColorError] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [quantityOptions, setQuantityOptions] = useState("ilimitado");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
    reset,
    setValue,
    clearErrors,
    register,
  } = useForm<updateProductFormValues>({
    defaultValues: {
      name: "",
      description: "",
      images: [],
      price: 0,
      offer: 0,
      quantity: "ilimitado",
      stock: 0,
      categories: [],
      colors: [],
      sizes: [],
    },
    mode: "onChange",
  });

  React.useEffect(() => {
    if (currentProduct) {
      setValue("name", currentProduct.name);
    }
  }, [currentProduct, setValue]);

  React.useEffect(() => {
    getProductItem();
    getCategoryList();
    getColorList();
    getSizeList();
  }, []);


  const getProductItem = () => {
    getProduct(params.id).then((res) => {
      console.log("Product response:", res.data);
      if (res.data && 'id' in res.data && 'name' in res.data) {
        const formattedProduct = {
          id: res.data.id,
          name: res.data.name,
          slug: res.data.slug,
          description: res.data.description,
          stock: res.data.stock,
          price: res.data.price,
          offer: res.data.offer,
          featured: res.data.featured,
          createdAt: res.data.createdAt,
          updatedAt: res.data.updatedAt,
          images: res.data.images.map((image: any): Image => ({
            id: image.id,
            url: image.url,
          })),
          colors: res.data.colors.map((color: any): Color => ({
            id: color.id,
            name: color.name,
            code: color.code,
          })),
          sizes: res.data.sizes.map((size: any): Size => ({
            id: size.id,
            name: size.name,
          })),
          categories: res.data.categories.map((category: any): Category => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            image: category.image,
          })),
        };

        // Almacenar el producto actual en el estado
        dispatch(setCurrentProduct(formattedProduct));
      } else {
        console.error("Invalid product data format:", res.data);
      }
    });
  };

  const getCategoryList = () => {
    getCategories().then((res) => {
      console.log("Category list response:", res.data);
      if (Array.isArray(res.data) && res.data.every(item => 'id' in item && 'name' in item && 'slug' in item && 'image' in item)) {
        dispatch(setCategories(res.data));
      } else {
        console.error("Invalid data format:", res.data);
      }
      dispatch(setCategories(res.data));
    });
  };

  const getColorList = () => {
    getColors().then((res) => {
      console.log("Color list response:", res.data);
      if (Array.isArray(res.data) && res.data.every(item => 'id' in item && 'name' in item && 'code' in item)) {
        dispatch(setColors(res.data));
      } else {
        console.error("Invalid data format:", res.data);
      }
    });
  };

  const getSizeList = () => {
    getSizes().then((res) => {
      console.log("Size list response:", res.data);
      if (Array.isArray(res.data) && res.data.every(item => 'id' in item && 'name' in item)) {
        dispatch(setSizes(res.data));
      } else {
        console.error("Invalid data format:", res.data);
      }
    });
  };

  return (
    <React.Fragment>
      yes
      {currentProduct?.name}
    </React.Fragment>
  );

}
