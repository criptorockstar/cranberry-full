"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { RootState, useAppSelector, useAppDispatch } from "@/store/store";
import Image from "next/image";
import Link from "next/link";

export default function CategoriesCarousel() {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5001/products/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        // Aquí puedes despachar una acción con los datos obtenidos, si es necesario
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [dispatch]);

  return (
    <React.Fragment>
      <div className="w-full mt-20">
        <div className="lg:text-[24px] font-semibold select-none xs:text-[18px] mb-[12px] ml-4">
          Categorias
        </div>
        <Carousel
          opts={{
            align: "start",
            containScroll: "trimSnaps",
            loop: false,
          }}
          className="w-full"
        >
          <div>
            <CarouselPrevious />
            <CarouselNext />
          </div>
          <CarouselContent className="flex -ml-4 space-x-4">
          </CarouselContent>
        </Carousel>
      </div>
    </React.Fragment>
  );
}
