"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button";
import { FilePenLine, Trash2 } from "lucide-react";
import useAdmin from "@/hooks/useAdmin";
import { useRouter } from "next/navigation";
import { deleteCategory as deleteCategoryFromSlice } from "@/store/slices/categorySlice";
import { useAppDispatch } from "@/store/store";

// Definir el tipo de datos de la categoría para el DataTable
export type Category = {
  id: number; // Asegúrate de que el ID sea de tipo number
  name: string;
  slug: string; // Puedes incluir otros campos si son necesarios
  image: string; // También puedes incluir otros campos si son necesarios
};

// Definir las columnas de la tabla
export const columns: ColumnDef<Category>[] = [
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
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { deleteCategory } = useAdmin();
      const router = useRouter();
      const dispatch = useAppDispatch();
      const category = row.original;

      const handleEdit = () => {
        // Navegar a la página de edición o abrir un modal de edición
        router.push(`/dashboard/categorias/editar/${category.id}`);
      };

      const handleDelete = async () => {
        // Confirmar la eliminación antes de proceder
        if (confirm(`¿Seguro que deseas eliminar la categoría ${category.name}?`)) {
          try {
            await deleteCategory(category.id);  // Elimina en el backend
            dispatch(deleteCategoryFromSlice(category.id));  // Elimina del estado Redux
            // Aquí también puedes refrescar la lista si lo necesitas
          } catch (error) {
            console.error("Error al eliminar la categoría:", error);
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
  },
];
