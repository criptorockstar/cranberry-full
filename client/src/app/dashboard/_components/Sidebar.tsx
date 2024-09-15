import React, { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link"
import { useRouter } from "next/navigation"

// Definición de las propiedades del componente Sidebar
interface SidebarProps {
  children: ReactNode; // Permite pasar elementos React como hijos
}

export default function Sidebar({ children }: SidebarProps) {
  return (
    <React.Fragment>
      <aside className="h-screen w-[250px]">
        <nav className="h-full flex flex-col bg-white border-r shadow-sm fixed w-[250px]">
          <div className="p-4 pb-2 flex justify-center items-center">
            <Image src="/logo.svg" alt="logo" width={100} height={100} />
          </div>
          <ul className="flex-1 px-3">{children}</ul>
        </nav>
      </aside>
    </React.Fragment>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode; // Permite pasar cualquier elemento React como ícono
  text: string;          // El texto que se mostrará en el elemento
  url: string;           // La URL a la que redirige el ítem
  active?: boolean;      // Indica si el ítem está activo
  alert?: boolean;       // Indica si debe mostrar una alerta
}

export function SidebarItem({ icon, text, url, active, alert }: SidebarItemProps) {
  const router = useRouter();
  return (
    <React.Fragment>
      <li
        onClick={() => router.push(url)}
        className={`relative flex items-center py-2 px-3 my-1
          font-medium rounded-md cursor-pointer transition-colors   
          ${active
            ? "bg-[#0a1d35] text-white"
            : "hover:bg-indigo-50 text-gray-600"}
          ${alert ? "bg-red-100" : ""}
        `}
      >
        <div className="flex items-center w-full">
          {icon}
          <span className="ml-2">{text}</span>
        </div>
      </li>
    </React.Fragment>
  );
}
