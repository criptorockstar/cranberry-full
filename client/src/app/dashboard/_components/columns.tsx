"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilePenLine, Trash2 } from "lucide-react";
import useProducts from "@/hooks/useProducts";
import { useAppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import { deleteProduct as deleteProductFromSlice } from "@/store/slices/productSlice";

// Mantener definiciones locales de tipos, si es necesario en este archivo.

export type Image = {
  id: number;
  url: string;
};

export type Color = {
  id: number;
  name: string;
  code: string;
};

export type Size = {
  id: number;
  name: string;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  image: string;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  stock: number;
  price: number;
  offer: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  images: Image[];
  colors: Color[];
  sizes: Size[];
  categories: Category[];
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          className="-ml-4"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Precio",
    cell: ({ getValue }) => `$${getValue<number>()}`,
  },
  {
    accessorKey: "offer",
    header: "Oferta",
    cell: ({ getValue }) => `$${getValue<number>()}`,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { deleteProduct } = useProducts();
      const router = useRouter();
      const dispatch = useAppDispatch();
      const product = row.original;

      const handleEdit = () => {
        // Navegar a la página de edición o abrir un modal de edición
        router.push(`/dashboard/editar/${product.id}`);
      };

      const handleDelete = async () => {
        // Confirmar la eliminación antes de proceder
        if (confirm(`¿Seguro que deseas eliminar el producto ${product.name}?`)) {
          try {
            await deleteProduct(product.id);  // Elimina en el backend
            dispatch(deleteProductFromSlice(product.id));  // Elimina del estado Redux
            // Aquí también puedes refrescar la lista si lo necesitas
          } catch (error) {
            console.error("Error al eliminar el producto:", error);
          }
        }
      };

      return (
        <div className="flex items-center justify-end space-x-2">
          <Button size="icon" className="rounded-full" onClick={handleEdit}>
            <FilePenLine />
          </Button>

          <Button size="icon" className="rounded-full" onClick={handleDelete}>
            <Trash2 />
          </Button>
        </div>
      );
    },
  }
];
