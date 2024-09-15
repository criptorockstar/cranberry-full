"use client";

import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Paper, SxProps, Toolbar, IconButton, Menu, MenuItem } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import useCategories from "@/hooks/useCategories";
import { setCategories, deleteCategory } from "@/store/slices/categorySlice";
import { useAppDispatch, useAppSelector } from '@/store/store';

import { useRouter } from "next/navigation";
import { Theme } from '@mui/material/styles';
import { Input } from '@/components/input';
import { Trash2, Edit, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import MenuComponent from "@/app/dashboard/_components/menu"
import DrawerComponent from "@/app/dashboard/_components/drawer"
import { Tag, Globe, LayoutDashboard, NotepadText } from "lucide-react";
import { deleteCategory as deleteCategoryFromSlice } from "@/store/slices/categorySlice";
import useAdmin from "@/hooks/useAdmin";

export type Category = {
  id: number; // Asegúrate de que el ID sea de tipo number
  name: string;
  slug: string; // Puedes incluir otros campos si son necesarios
  image: string; // También puedes incluir otros campos si son necesarios
};

export default function CategoriesPanel() {
  const dispatch = useAppDispatch();
  const { getCategories } = useCategories();
  const categories = useAppSelector((state) => state.categories.categories);

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const router = useRouter();

  const [searchText, setSearchText] = React.useState<string>('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);
  const [selectedCategories, setSelectedCategories] = React.useState<number[]>([]);

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

  const handleEdit = (id: number) => {
    router.push(`/dashboard/categorias/editar/${id}`);
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`¿Seguro que deseas eliminar el producto ${name}?`)) {
      try {
        deleteCategory(id);
        dispatch(deleteCategoryFromSlice(id));
      } catch (error) {
        console.error("Error al eliminar la categoria:", error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (confirm(`¿Seguro que deseas eliminar los productos seleccionados?`)) {
      try {
        for (const id of selectedCategories) {
          const product = categories.find((prod) => prod.id === id);
          if (product) {
            deleteCategory(id);
            dispatch(deleteCategoryFromSlice(id));
          }
        }
        setSelectedCategories([]);  // Limpiar la selección después de eliminar
      } catch (error) {
        console.error("Error al eliminar los productos:", error);
      }
    }
  };

  const handleSelectionChange = (selection: number[]) => {
    setSelectedCategories(selection);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, category: Category) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCategory(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const filteredCategories = categories.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const datagridSx: SxProps = {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 4,
    width: '100%',
    height: 'calc(100vh - 150px)',
  };

  const items = [
    { slug: "/dashboard", text: "Productos", icon: <Tag size={20} /> },
    { slug: "/dashboard/categorias", text: "Categorias", icon: <LayoutDashboard size={20} /> },
    { slug: "/dashboard/pedidos", text: "Pedidos", icon: <NotepadText size={20} /> },
    { slug: "/", text: "Ir al sitio Web", icon: <Globe size={20} /> },
  ];

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Producto",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 1,
      renderCell: (params: any) => (
        <div className="flex space-x-2 items-center h-full">
          {!isMobile ? (
            <>
              <Button
                size="icon"
                className="rounded-full"
                onClick={() => handleEdit(params.row.id)}
              >
                <Edit />
              </Button>
              <Button
                size="icon"
                className="rounded-full"
                onClick={() => handleDelete(params.row.id, params.row.name)}
              >
                <Trash2 />
              </Button>
            </>
          ) : (
            <>
              <div className="flex justify-center items-center h-full ml-3">
                <IconButton
                  size="small"
                  onClick={(event) => handleMenuOpen(event, params.row)}
                >
                  <MoreVertical />
                </IconButton>
              </div>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => {
                  handleEdit(selectedCategory!.id);
                  handleMenuClose();
                }}>
                  <Edit />
                  <span className="ml-2">Editar</span>
                </MenuItem>
                <MenuItem onClick={() => {
                  handleDelete(selectedCategory!.id, selectedCategory!.name);
                  handleMenuClose();
                }}>
                  <Trash2 />
                  <span className="ml-2">Borrar</span>
                </MenuItem>
              </Menu>
            </>
          )}
        </div>
      ),
    },
  ].filter(Boolean) as GridColDef[];

  return (
    <React.Fragment>
      <DrawerComponent items={items} />
      <div className="px-4 sm:px-8 bg-[#f0f0f0]">
        <div className="font-semibold text-2xl mt-2">
          <div className="flex flex-row items-center">
            <div>
              <MenuComponent />
            </div>
            <div>
              <div>Categorias</div>
              <div className="text-xs font-normal">Crea categorías para organizar tus productos y tener un mejor control de lo que vendes.</div>
            </div>
          </div>
        </div>

        <Toolbar sx={{ px: 0, mx: 0 }}>
          <div className="flex flex-col-reverse xl:flex-row xl:justify-between w-full mt-4 mx-0 px-0">
            <div className="flex-grow xl:-ml-6">
              <Input
                className="bg-white border border-black w-full max-w-[555px]"
                placeholder="Buscar"
                value={searchText}
                onChange={handleSearchChange}
              />
            </div>
            <div className="flex justify-end xl:justify-normal mb-2 xl:mb-0 space-x-4 xl:ml-4 xl:-mr-4">
              {selectedCategories.length > 0 && (
                <Button
                  size="icon"
                  className="rounded-full"
                  onClick={handleBulkDelete}
                >
                  <Trash2 />
                </Button>
              )}
              <Button asChild>
                <Link href="/dashboard/categorias/agregar-categoria">Agregar categoria</Link>
              </Button>
            </div>
          </div>
        </Toolbar>

        <div className="-mt-8">
          <Paper sx={datagridSx}>
            <div className="h-full">
              <DataGrid
                rows={filteredCategories}
                columns={columns}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={(newSelection: any) => handleSelectionChange(newSelection as number[])}
                sx={{
                  height: '100%',
                  width: '100%',
                  overflowX: 'auto',
                  '& .MuiDataGrid-cell': {
                    whiteSpace: 'normal',
                  },
                  '& .MuiDataGrid-cell:focus': {
                    outline: 'none',  // Elimina el borde en el focus
                  },
                  '& .MuiDataGrid-columnHeader:focus': {
                    outline: 'none',  // Elimina el borde en el focus de la cabecera
                  },
                }}
              />
            </div>
          </Paper>
        </div>
      </div>
    </React.Fragment >
  );
}
