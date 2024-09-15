"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { setCategories } from "@/store/slices/categorySlice";
import useCategories from "@/hooks/useCategories";
import Image from "next/image";
import Link from "next/link";

export default function CategoriesCarousel() {
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
      <Carousel className="w-full container mx-auto mt-20"
        opts={{
          align: "start",
        }}
      >
        <div className="relative">
          <div className="mb-4 font-weight-600 xl:text-[30px]">
            Categorias
          </div>

          <div className="">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </div>
        <CarouselContent>
          {categories.map((category) => (
            <CarouselItem
              key={category.id}
              className="ss:basis-1/3 sm:basis-1/3 md:basis-1/4 lg:basis-1/4"
            >
              <div className="w-full max-w-[100%] relative mx-auto">
                <Link href="/">
                  <Image
                    src={`${category.image}`}
                    alt={category.name}
                    className="object-cover w-full h-full"
                    width={115}
                    height={68}
                    sizes="(max-width: 600px) 100px, 100px"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 rounded-[4px]" />
                  <div className="hidden absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="text-center select-none text-white font-semibold">
                      {category.name || "Unnamed Category"}
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
