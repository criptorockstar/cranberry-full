"use client";

import * as React from 'react';
import { columns } from "@/app/dashboard/categorias/columns";
import { DataTable } from "@/app/dashboard/categorias/data-table";
import useCategories from "@/hooks/useCategories";
import { setCategories } from "@/store/slices/categorySlice";
import { useAppDispatch, useAppSelector } from '@/store/store';

export default function CategoriesPanel() {
  const dispatch = useAppDispatch();
  const { getCategories } = useCategories();
  const categories = useAppSelector((state) => state.categories.categories);

  React.useEffect(() => {
    getCategoryList();
  }, []);

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

  return (
    <React.Fragment>
      <div className="p-6">
        <div className="font-semibold text-2xl bg-[#f0f0f0]">
          <span>Categorias</span>
        </div>
        <div>Crea categorías para organizar tus productos y tener un mejor control de lo que vendes.</div>

        <div className="mt-2">
          <DataTable columns={columns} data={categories} />
        </div>
      </div>
    </React.Fragment>
  );
}
