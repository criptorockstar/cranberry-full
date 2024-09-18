"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserRound } from "lucide-react";
import { RootState, useAppSelector, useAppDispatch } from "@/store/store";
import { clearUserState } from "@/store/slices/userSlice"
import Cookies from "js-cookie";
import Select from "@/app/_components/select";
import { useMediaQuery } from "@/components/use-media-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const getSelectOptions = (user: any) => {
  if (user.role === "Admin") {
    return ["Administrar", "Cerrar sesión"];
  }
  return ["Cerrar sesión"];
};

export default function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user);
  const selectOptions = getSelectOptions(user);

  const isDesktop = useMediaQuery("(min-width: 1200px)");

  const onSelectChange = (value: string) => {
    if (value === "Cerrar sesión") {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      dispatch(clearUserState());
      router.push("/iniciar-sesion");
    }
    if (value === "Administrar") {
      router.push("/dashboard");
    }
  };


  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    dispatch(clearUserState());
    router.push("/iniciar-sesion");
  };

  return (
    <React.Fragment>
      <div className="flex justify-between items-center container mx-auto">
        <Button
          onClick={() => router.push("/cart")}
          size="icon"
          className="flex sm:hidden ml-5 bg-[transparent] rounded-full hover:bg-[transparent] shadow-none"
        >
          <img src="/shopping_bag.svg" width={40} height={40} className="text-gray-900" />
        </Button>

        <div className="flex items-center gap-8">
          <Image src="/logo.svg" alt="logo" width={100} height={100} />
        </div>

        {!user.email ? (
          <Button
            onClick={() => router.push("/iniciar-sesion")}
            size="icon"
            className="flex sm:hidden mr-5 rounded-full hover:bg-[transparent] bg-[transparent] shadow-none"
          >
            <UserRound size={40} className="text-gray-900  hover:bg-[transparent] bg-[transparent]" />
          </Button>
        ) : (
          <div
            className="flex sm:hidden mr-2.5 rounded-full hover:bg-[transparent] bg-[transparent] shadow-none"
          >
            <DropdownMenu>
              <DropdownMenuTrigger>
                <UserRound size={40} className="text-gray-900  hover:bg-[transparent] bg-[transparent]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><Link href="/dashboard">Administrar</Link></DropdownMenuItem>
                <DropdownMenuItem><div onClick={logout}>Cerrar sesión</div></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <ul className="items-center gap-8 font-weight-500 hidden sm:flex">
          <li>
            <Link href="/">Inicio</Link>
          </li>
          <li>
            <Link href="/productos">Productos</Link>
          </li>
          <li>
            <Link href="/encuentranos">Encuentranos</Link>
          </li>
        </ul>

        <div className="sm:flex items-center gap-8 hidden">
          <Button
            onClick={() => router.push("/cart")}
            size="icon"
            className="bg-[#f0f0f0] rounded-full hover:bg-[transparent]"
          >
            <img src="/shopping_bag.svg" width={40} height={40} className="text-gray-900" />
          </Button>

          {!user.email ? (
            <Button
              onClick={() => router.push("/iniciar-sesion")}
              className="px-6"
            >
              Login
            </Button>
          ) : (
            <Select
              value="Mi cuenta"
              options={selectOptions}
              updateValue={onSelectChange}
              className="z-20 bg-[#0a1d35] capitalize hover:cursor-pointer mt-[-8px]"
              textColor="text-white"
            />
          )}
        </div>
      </div>

      <div className="overflow-hidden bg-[#f5f5dc] py-[10px]">
        <div className="marquee whitespace-nowrap text-[16px] text-center">
          ¡Promos todos los fines de semana! 25% de descuento en productos
          seleccionados
        </div>
      </div>
      <style jsx>
        {`
          .marquee {
            display: inline-block;
            padding-left: 30%;
            animation: marquee 15s linear infinite;
          }

          @keyframes marquee {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        `}
      </style>

      {!isDesktop &&
        (
          <div className="fixed bottom-4 left-0 right-0 z-10">
            <div className="bg-[#1d1d1d] max-w-[350px] h-[65px] mx-auto rounded-[40px]">
              <div className="w-[250px] mx-auto">
                <div className="flex flex-row justify-between items-center h-[65px]">
                  <div>
                    <Button
                      onClick={() => router.push("/")}
                      size="icon" className="rounded-full bg-[#191919] w-[50px] h-[50px]">
                      <img src="/home.svg" alt="" />
                    </Button>
                  </div>

                  <div>
                    <Button
                      onClick={() => router.push("/productos")}
                      size="icon" className="rounded-full bg-[#191919] w-[50px] h-[50px]">
                      <img src="/store.svg" alt="" />
                    </Button>
                  </div>

                  <div>
                    <Button
                      onClick={() => router.push("/encuentranos")}
                      size="icon" className="rounded-full bg-[#191919] w-[50px] h-[50px]">
                      <img src="/location.svg" alt="" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </React.Fragment>
  );
}
