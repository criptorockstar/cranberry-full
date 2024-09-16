import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useProducts from "@/hooks/useProducts";
import { setProducts } from "@/store/slices/productSlice";
import { useAppDispatch, useAppSelector } from '@/store/store';
import { Image as image, Color, Size, Category } from '@/store/slices/productSlice';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FeaturedCarousel() {
  const dispatch = useAppDispatch();
  const { getFeaturedProducts } = useProducts();

  const products = useAppSelector((state) => state.products.products);

  React.useEffect(() => {
    getProductList();
  }, []);

  const getProductList = () => {
    getFeaturedProducts().then((res) => {
      console.log("Product list response:", res.data);
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
          images: item.images.map((image: any): image => ({
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
      dispatch(setProducts(res.data));
    });
  };

  return (
    <React.Fragment>
      <Carousel className="w-full container mx-auto mt-20"
        opts={{
          align: "start",
        }}
      >
        <div className="relative">
          <div className="mb-4 font-weight-600 xl:text-[30px]">
            Productos destacados
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
              className="ss:basis-1/3 sm:basis-1/3 md:basis-1/4 lg:basis-1/4"
            >
              <div className="group relative w-full max-w-[100%] mx-auto">
                <div>
                  <Image
                    src={`${product.images[0].url}?width=115&height=68`}
                    alt={product.name}
                    className="object-cover w-full h-full"
                    width={115}
                    height={68}
                    sizes="(max-width: 600px) 100px, 100px"
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
