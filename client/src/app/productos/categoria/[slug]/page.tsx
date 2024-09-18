"use client"

import * as React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setProducts } from "@/store/slices/productSlice";
import useProducts from "@/hooks/useProducts";
import { Image, Color, Size, Category } from '@/store/slices/productSlice';
import { Button } from "@/components/ui/button";
import MenuComponent from "@/app/dashboard/_components/menu"
import DrawerComponent from "@/app/dashboard/_components/drawer"
import { Tag, Globe, LayoutDashboard, NotepadText } from "lucide-react";
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Filters from "../../_components/Filters"

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

export default function ProductsByCategoryPage() {
  const dispatch = useAppDispatch();
  const { getProducts } = useProducts();
  const products = useAppSelector((state) => state.products.products);

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
        console.log("productos:", formattedProducts)

        dispatch(setProducts(formattedProducts));
      } else {
        console.error("Invalid data format:", res.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const truncateText = (text: any, maxLength: any) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const ITEMS_PER_PAGE = 9;
  const [currentPage, setCurrentPage] = React.useState(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);

  // Calcula el número total de páginas
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const addToCart = (e: any) => {
    e.preventDefault();
    console.log("addToCart");
  };

  const items = [
    { slug: "/dashboard", text: "Productos", icon: <Tag size={20} /> },
    { slug: "/dashboard/categorias", text: "Categorias", icon: <LayoutDashboard size={20} /> },
    { slug: "/dashboard/pedidos", text: "Pedidos", icon: <NotepadText size={20} /> },
    { slug: "/", text: "Ir al sitio Web", icon: <Globe size={20} /> },
  ];

  return (
    <React.Fragment>
      <DrawerComponent items={items} />


      <div className="flex flex-col min-h-screen max-w-[1200px] mx-auto">
        {/* Contenedor que crece para ocupar todo el espacio */}
        <div className=" flex flex-row">
          <div>
            <MenuComponent />
          </div>

          <div className="max-w-[200px] xl:hidden">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger><span className="text-[20px]">Filtros</span></AccordionTrigger>
                <AccordionContent>
                  <div className="">
                    <Filters />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div className="flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProducts.map((product) => {
              const mainImage = product.images[0]?.url;
              return (
                <Link
                  href={`/productos/producto/${product.slug}`}
                  key={product.id}
                  className="relative flex flex-col bg-white rounded-md overflow-hidden shadow-lg transition-transform transform hover:scale-105 group"
                >
                  <div className="relative flex-grow">
                    <img
                      src={mainImage}
                      alt={product.name || "Product Image"}
                      className="w-full h-[200px] object-cover"
                      width={500}
                      height={300}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 rounded-md opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                    <Button
                      onClick={addToCart}
                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#0a1d35] text-white rounded-md px-8 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      data-hover={false}
                    >
                      Add to cart
                    </Button>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="text-xl font-semibold mb-2 truncate">
                      {truncateText(product.name || "Title", 24)}
                    </div>
                    <div className="text-base font-light mb-2 truncate">
                      {product.description}
                    </div>
                    <div className="mt-auto text-xl font-semibold">
                      ${product.price.toFixed(2)}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Contenedor de paginación */}
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 border rounded-md ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-white text-blue-500 border-blue-500"}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
