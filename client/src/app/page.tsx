"use client";

import React from "react";
import Image from "next/image";
export default function Home() {
  return (
    <React.Fragment>
      <div className="container mx-auto">
        <Image
          src="/banner.png"
          width={400}
          height={300}
          alt="banner"
          className="w-full"
        />
      </div>
    </React.Fragment>
  );
}
