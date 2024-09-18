"use client"

import React from "react"
import Sidebar from "./_components/Sidebar"
import { usePathname } from "next/navigation";

function ProductsLayout({ children }: any) {
  const pathname = usePathname();
  const noRenderRoutes = ["/productos/producto/",];
  const shouldRender = !noRenderRoutes.some((route) =>
    pathname.startsWith(route),
  );
  return (
    <React.Fragment>
      <div className="flex justify-center pt-4">
        <div className="w-full max-w-[1200px] flex">
          {/* Sidebar */}

          {shouldRender && (
            <div className="w-[225px] p-4 hidden lg:block">
              <Sidebar />
            </div>
          )}

          {/* Body */}
          {shouldRender ? (
            <div className="flex-1 bg-white mx-2">
              {children}
            </div>
          ) : (
            <div className="flex-1 mx-4">
              {children}
            </div>
          )}

        </div>
      </div>
    </React.Fragment>
  )
}

export default ProductsLayout
