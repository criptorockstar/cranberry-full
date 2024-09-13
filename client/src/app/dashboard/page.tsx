"use client";

import * as React from 'react';
import { columns } from "@/app/dashboard/_components/columns";
import { DataTable } from "@/app/dashboard/_components/data-table";
import useProducts from "@/hooks/useProducts";
import { setProducts } from "@/store/slices/productSlice";
import { useAppDispatch, useAppSelector } from '@/store/store';
import { Image, Color, Size, Category } from '@/store/slices/productSlice';

export default function DashboardTable() {
  const dispatch = useAppDispatch();
  const { getProducts } = useProducts();
  const products = useAppSelector((state) => state.products.products);

  React.useEffect(() => {
    getProductList();
  }, []);

  const getProductList = async () => {
    try {
      const res = await getProducts();
      console.log("Product list response:", res.data);

      if (Array.isArray(res.data)) {
        const formattedProducts = res.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          description: item.description,
          stock: item.stock,
          price: item.price,
          offer: item.offer,
          featured: item.featured,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          images: item.images.map((image: any): Image => ({
            id: image.id,
            url: image.url,
          })),
          colors: item.colors.map((color: any): Color => ({
            id: color.id,
            name: color.name,
            code: color.code,
          })),
          sizes: item.sizes.map((size: any): Size => ({
            id: size.id,
            name: size.name,
          })),
          categories: item.categories.map((category: any): Category => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            image: category.image,
          })),
        }));

        // Despachar los productos formateados al estado
        dispatch(setProducts(formattedProducts));
      } else {
        console.error("Invalid data format:", res.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <React.Fragment>
      <div className="p-8">
        <div className="font-semibold text-2xl">Productos</div>

        <div className="mt-0">
          <DataTable columns={columns} data={products} />
        </div>
      </div>
    </React.Fragment>
  );
}
