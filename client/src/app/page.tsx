"use client";

import React from "react";
import Image from "next/image";
import CategoriesCarousel from "@/app/_components/Categories-carousel"
import FeaturedCarousel from "@/app/_components/Featured-carousel"

export default function Home() {
  return (
    <React.Fragment>
      <div className="container mx-auto mt-2">
        <Image
          src="/banner.png"
          width={400}
          height={300}
          alt="banner"
          className="w-full"
        />
      </div>

      <CategoriesCarousel />
      <FeaturedCarousel />
    </React.Fragment>
  );
}
