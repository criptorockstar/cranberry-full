"use client";

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
              <div className="w-full max-w-[100%] relative mx-auto">
                <Link href="/">
                  <Image
                    src={`${product.images[0].url}?width=115&height=68`}
                    alt={product.name}
                    className="object-cover w-full h-full"
                    width={115}
                    height={68}
                    sizes="(max-width: 600px) 100px, 100px"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 rounded-[4px]" />
                  <div className="hidden absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="text-center select-none text-white font-semibold">
                      {product.name || "Unnamed Category"}
                    </div>
                  </div>
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </React.Fragment>
  );
}
