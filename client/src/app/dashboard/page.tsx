"use client";

import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Paper, SxProps, Toolbar, IconButton, Menu, MenuItem } from '@mui/material';
import useProducts from "@/hooks/useProducts";
import { setProducts, deleteProduct as deleteProductFromSlice } from "@/store/slices/productSlice";
import useAdmin from "@/hooks/useAdmin";
import { useAppDispatch, useAppSelector } from '@/store/store';
import { Image, Color, Size, Category } from '@/store/slices/productSlice';
import { useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { Input } from '@/components/input';
import { Trash2, Edit, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import MenuComponent from "@/app/dashboard/_components/menu"
import DrawerComponent from "@/app/dashboard/_components/drawer"
import { Tag, Globe, LayoutDashboard, NotepadText } from "lucide-react";

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

const datagridSx: SxProps = {
  marginLeft: "auto",
  marginRight: "auto",
  marginTop: 4,
  width: '100%',
  height: 'calc(100vh - 150px)',
};

export default function DashboardTable() {
  const [searchText, setSearchText] = React.useState<string>('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = React.useState<number[]>([]);

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { getProducts } = useProducts();
  const { deleteProduct } = useAdmin();
  const products = useAppSelector((state) => state.products.products);

  const handleEdit = (id: number) => {
    router.push(`/dashboard/editar/${id}`);
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`¿Seguro que deseas eliminar el producto ${name}?`)) {
      try {
        await deleteProduct(id);
        dispatch(deleteProductFromSlice(id));
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (confirm(`¿Seguro que deseas eliminar los productos seleccionados?`)) {
      try {
        for (const id of selectedProducts) {
          const product = products.find((prod) => prod.id === id);
          if (product) {
            await deleteProduct(id);
            dispatch(deleteProductFromSlice(id));
          }
        }
        setSelectedProducts([]);  // Limpiar la selección después de eliminar
      } catch (error) {
        console.error("Error al eliminar los productos:", error);
      }
    }
  };

  const handleSelectionChange = (selection: number[]) => {
    setSelectedProducts(selection);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, product: Product) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProduct(null);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Producto",
      flex: 1,
    },
    !isMobile && {
      field: "stock",
      headerName: "Stock",
      flex: 1,
    },
    !isMobile && {
      field: "price",
      headerName: "Precio",
      flex: 1,
    },
    !isMobile && {
      field: "offer",
      headerName: "Oferta",
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
                  handleEdit(selectedProduct!.id);
                  handleMenuClose();
                }}>
                  <Edit />
                  <span className="ml-2">Editar</span>
                </MenuItem>
                <MenuItem onClick={() => {
                  handleDelete(selectedProduct!.id, selectedProduct!.name);
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

  React.useEffect(() => {
    getProductList();
  }, []);

  const getProductList = async () => {
    try {
      const res = await getProducts();
      if (Array.isArray(res.data)) {
        const formattedProducts = res.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          description: item.description,
          stock: item.stock,
          quantity: item.quantity,
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

        dispatch(setProducts(formattedProducts));
      } else {
        console.error("Invalid data format:", res.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const items = [
    { slug: "/dashboard", text: "Productos", icon: <Tag size={20} /> },
    { slug: "/dashboard/categorias", text: "Categorias", icon: <LayoutDashboard size={20} /> },
    { slug: "/dashboard/pedidos", text: "Pedidos", icon: <NotepadText size={20} /> },
    { slug: "/", text: "Ir al sitio Web", icon: <Globe size={20} /> },
  ];

  return (
    <React.Fragment>
      <DrawerComponent items={items} />
      <div className="px-4 sm:px-8">
        <div className="font-semibold text-2xl mt-2">
          <div className="flex flex-row items-center">
            <div>
              <MenuComponent />
            </div>
            <div>Productos</div>
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
              {selectedProducts.length > 0 && (
                <Button
                  size="icon"
                  className="rounded-full"
                  onClick={handleBulkDelete}
                >
                  <Trash2 />
                </Button>
              )}
              <Button asChild>
                <Link href="/dashboard/agregar-producto">Agregar producto</Link>
              </Button>
            </div>
          </div>
        </Toolbar>

        <div className="-mt-8">
          <Paper sx={datagridSx}>
            <div className="h-full">
              <DataGrid
                rows={filteredProducts}
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
    </React.Fragment>
  );
}
