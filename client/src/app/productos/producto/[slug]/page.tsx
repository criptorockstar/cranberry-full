"use client";

import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setProducts, getCurrentProduct } from "@/store/slices/productSlice";
import useProducts from "@/hooks/useProducts";
import { Product, Image as ImageProduct, Color, Size, Category } from '@/store/slices/productSlice';
import Image from "next/image"
import { Input } from "@/components/input"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link"
import { useMediaQuery } from "@/components/use-media-query";
import { Tag, Globe, LayoutDashboard, NotepadText } from "lucide-react";
import MenuComponent from "@/app/dashboard/_components/menu"
import DrawerComponent from "@/app/dashboard/_components/drawer"

export default function ProductPage() {
  const isDesktop = useMediaQuery("(min-width: 1200px)");
  const { slug } = useParams();
  const { getProducts } = useProducts();

  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.products);

  useEffect(() => {
    getProductList();
  }, []);

  const getProductList = async () => {
    try {
      const res = await getProducts();
      if (Array.isArray(res.data)) {
        const formattedProducts: Product[] = res.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          description: item.description,
          stock: item.stock,
          price: item.price,
          offer: item.offer,
          quantity: item.quantity,
          featured: item.featured,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          images: item.images.map((image: any): ImageProduct => ({
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

  // Normalize `slug` to string if it's an array
  const normalizedSlug = Array.isArray(slug) ? slug[0] : slug;

  // Ensure that `normalizedSlug` is a string before passing it
  const currentProduct = normalizedSlug ? getCurrentProduct({ products }, normalizedSlug) : undefined;

  const items = [
    { slug: "/dashboard", text: "Productos", icon: <Tag size={20} /> },
    { slug: "/dashboard/categorias", text: "Categorias", icon: <LayoutDashboard size={20} /> },
    { slug: "/dashboard/pedidos", text: "Pedidos", icon: <NotepadText size={20} /> },
    { slug: "/", text: "Ir al sitio Web", icon: <Globe size={20} /> },
  ];

  if (!currentProduct) {
    return <div>Loading...</div>;
  }


  return (
    <React.Fragment>
      <DrawerComponent items={items} />
      <div className="py-8 w-full max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="xl:hidden -mt-12">
          <MenuComponent />
        </div>
        {/* First Column: Large Image */}
        <div className="relative">
          <div className="absolute inset-0">
            <Image
              src={currentProduct.images[0].url}
              alt={currentProduct.name || "Product Image"}
              className="object-cover max-w-[97%] ml-[3%] h-full rounded-xl"
              layout="fill"
            />
          </div>
        </div>

        {!isDesktop && (
          <div>
            <div className="relative flex-grow">
              <img
                src={currentProduct.images[0].url}
                alt={currentProduct.name || "Product Image"}
                className="w-full h-[200px] object-cover"
                width={500}
                height={300}
              />
            </div>
          </div>
        )}

        {/* Second Column: Product Details */}
        <div className="flex flex-col space-y-4 pl-8 bg-white  lg:min-w-[400px] max-w-[650px]">
          <div>
            <h1 className="text-[30px] font-bold">{currentProduct.name}</h1>
            <p className="text-[20px] font-light">{currentProduct.description}</p>

            <div className="flex flex-row mt-3">
              {currentProduct.offer > 0 ? (
                <>
                  <div className="text-[24px] font-weight-500">
                    ${currentProduct.price.toFixed(2)}
                  </div>
                  <div className="text-[24px] ml-4 text-[#7D7D7D] line-through">
                    ${currentProduct.offer.toFixed(2)}
                  </div>
                </>
              ) : (
                <div className="text-[24px] font-weight-500">
                  ${currentProduct.price.toFixed(2)}
                </div>
              )}
            </div>

            <div>
              <div className="text-[20px] font-semibold mt-5">Talle</div>

              <div className="mt-2 bg-white rounded-xl ml-[-3px]">
                <div className="flex flex-row flex-wrap">
                  <div className="flex flex-row flex-wrap">
                    {currentProduct.sizes.map((size) => (
                      <div key={size.id} className="flex flex-col items-center mb-4 mx-2">
                        <div
                          className="w-[40px] h-[40px] rounded-md bg-white text-black border-black border"
                        >
                          <div className="flex items-center justify-center h-full">
                            {size.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-[20px] font-semibold mt-2">Color</div>

              <div className="mt-2 bg-white rounded-xl ml-[-3px]">
                <div className="flex flex-row flex-wrap">
                  <div className="flex flex-row flex-wrap">
                    {currentProduct.colors.map((color) => (
                      <div key={color.id} className="flex flex-col items-center mb-4 mx-2">
                        <div
                          className="w-[40px] h-[40px] rounded-md border-black border"
                          style={{ backgroundColor: color.code }}
                        >
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-[120px]">
              <Input
                isNumeric={true}
              />
            </div>

            <div className="">
              <Button size="lg" className="h-[60px] bg-[#0a1d35]">
                <img src="/shopping_bag_white.png" width={24} height={24} className="mr-2" />
                <span>Agregar al carrito</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-10 ml-6">
          <Carousel>
            <CarouselContent>
              {currentProduct.images.map((image) => (
                <CarouselItem
                  key={image.url}
                  className="basis-1/3 sm:basis-1/3 md:basis-1/3 lg:basis-1/3"
                >
                  <div className="group relative w-full max-w-[100%] mx-auto">
                    <div>
                      <Image
                        src={`${image.url}?width=115&height=68`}
                        alt={image.url}
                        className="object-cover w-full h-full"
                        width={109}
                        height={125}
                        sizes="(max-width: 600px) 109px, 125px"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      <Carousel className="w-full max-w-[1125px] mx-auto mt-8"
        opts={{
          align: "start",
        }}
      >
        <div className="relative">
          <div className="mb-4 font-weight-600 text-[20px] xl:text-[30px]">
            Otros productos
          </div>

          <div>
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </div>
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-1/3 sm:basis-1/3 md:basis-1/4 lg:basis-1/4"
            >
              <div className="group relative w-full max-w-[100%] mx-auto">
                <div>
                  <Image
                    src={`${product.images[0].url}?width=115&height=68`}
                    alt={product.name}
                    className="object-cover w-full h-full"
                    width={109}
                    height={125}
                    sizes="(max-width: 600px) 109px, 125px"
                  />
                  {/* Superposición en hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-20 rounded-md opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                  {/* Botón visible en hover */}
                  <Button
                    onClick={() => console.log("asd")}
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 hover:bg-[#0a1d35] bg-[#0a1d35] text-white rounded-md px-3 z-20 xl:px-8 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] xl:text-[14px]"
                    data-hover={false}
                  >
                    Agregar al carrito
                  </Button>
                </div>
              </div>
              <div className="flex flex-col flex-grow justify-between">
                <Link
                  href={`/productos/${product.slug}`}
                  className="mt-4 lg:text-xl xs:text-[16px] font-semibold"
                >
                  {product.name || "Title"}
                </Link>
                <div className="text-lg font-light mt-1 xs:text-[12px] leading-4 xs:max-w-[100px] lg:max-w-full">
                  {product.description || "Information about the item."}
                </div>
                <div className="mt-1 text-xl font-semibold">
                  ${product.price.toFixed(2)}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </React.Fragment>
  );
}
