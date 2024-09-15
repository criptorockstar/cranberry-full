"use client";

import React from "react";
import { useMediaQuery } from "@/components/use-media-query";
import { usePathname } from "next/navigation";
import Sidebar from "./_components/Sidebar";
import { SidebarItem } from "./_components/Sidebar";
import { Tag, Globe, LayoutDashboard, NotepadText } from "lucide-react";
import { useRouter } from "next/navigation"

export default function AdminLayout({ children }: any) {
  const isActive = (basePath: string) => {
    return pathname === basePath || pathname.startsWith(basePath + "/");
  };

  const router = useRouter()
  const isDesktop = useMediaQuery("(min-width: 1200px)");
  const pathname = usePathname();
  return (
    <React.Fragment>
      <div className="h-screen flex">
        {isDesktop && (
          <Sidebar>
            <SidebarItem
              icon={<Tag size={20} />}
              text="Productos"
              url="/dashboard"
              active={pathname === "/dashboard" || isActive("/dashboard/editar") || isActive("/dashboard/agregar-producto")}
            />
            <SidebarItem
              icon={<LayoutDashboard size={20} />}
              text="Categorías"
              url="/dashboard/categorias"
              active={pathname === "/dashboard/categorias" || isActive("/dashboard/categorias")}
            />
            <SidebarItem
              icon={<NotepadText size={20} />}
              text="Pedidos"
              url="/dashboard/pedidos"
              active={pathname === "/dashboard/pedidos"}
            />
            <SidebarItem
              icon={<Globe size={20} />}
              text="Ir al sitio web"
              url="/"
              active={pathname === "/"}
            />
          </Sidebar>
        )}

        <div className="flex-1 bg-[#f0f0f0]">
          {children}
        </div>
      </div>
    </React.Fragment>
  );
}
