import React from "react";
import Image from "next/image";
import Link from "next/link";
import { hindSiliguri } from "@/components/fonts";
import Icon from "@/components/icon";

export default function Footer() {
  return (
    <React.Fragment>
      <footer className="mt-8">
        <div className="container mx-auto">
          <div
            className={`${hindSiliguri.className} text-[30px] font-semibold mx-4`}
          >
            Información
          </div>

          <div className="grid lg:grid-cols-3 gap-6 my-16 xs:mx-auto xs:space-y-12 lg:space-y-0">
            <div className="text-center lg:text-left mx-4">
              <img src="/shipping.svg" className="text-[50px] xl:mx-0 mx-auto" />
              <h4 className="font-semibold text-[24px] leading-[37px] mt-4">
                Envíos
              </h4>
              <p className="text-[22px] leading-[30px] font-normal mt-3">
                El envío lo abona el cliente Envío a todo el país
              </p>
            </div>

            <div className="text-center lg:text-left mx-4">
              <img src="/whatsapp.svg" className="text-[50px] xl:mx-0 mx-auto" />
              <h4 className="font-semibold text-[24px] leading-[37px] mt-4">
                WhatsApp
              </h4>
              <p className="text-[22px] leading-[30px] font-normal mt-3">
                Hacé tu consulta por WhatsApp, recibí atención personalizada
              </p>
            </div>

            <div className="text-center lg:text-left mx-4">
              <img src="/money.svg" className="text-[50px] xl:mx-0 mx-auto" />
              <h4 className="font-semibold text-[24px] leading-[37px] mt-4">
                Abona
              </h4>
              <p className="text-[22px] leading-[30px] font-normal mt-3">
                Abona en Efectivo, Transferencia y depósito bancario
              </p>
            </div>
          </div>
        </div>

        {/**/}
        <div className="bg-black w-full pb-12">
          <div className="lg:max-w-[1200px] mx-auto">
            <div className="grid lg:grid-cols-4 text-white pt-12 gap-0 xs:space-y-12 lg:space-y-0">
              <div className="lg:flex lg:justify-start lg:items-center flex-shrink-0">
                <Image
                  src="/logo.svg"
                  width={115}
                  height={68}
                  alt="Logo"
                  className="xs:mx-auto lg:mx-0"
                />
              </div>

              <div className="text-center lg:text-left xs:mx-4 lg:ml-[-10px]">
                <h2 className="text-[24px] leading-[32px] font-semibold mb-4">
                  Información
                </h2>
                <ul className="list-inside text-[22px]">
                  <li>
                    <Link href="/carrito">Mi Carrito</Link>
                  </li>
                  <li>
                    <Link href="/iniciar-sesion">Login</Link>
                  </li>
                </ul>
              </div>

              <div className="text-center lg:text-left xs:mx-4 lg:ml-[-10px]">
                <h2 className="text-[24px] leading-[32px] font-semibold mb-4">
                  Servicios
                </h2>
                <ul className="list-inside text-[22px]">
                  <li>
                    <Link href="/">Inicio</Link>
                  </li>
                  <li>
                    <Link href="/productos">Productos</Link>
                  </li>
                  <li>
                    <Link href="/contacto">Contacto</Link>
                  </li>
                </ul>
              </div>

              <div className="text-center lg:text-left xs:mx-4 lg:ml-[-10px]">
                <h2 className="text-[24px] leading-[32px] font-semibold mb-4">
                  Contacto
                </h2>
                <ul className="list-inside text-[22px]">
                  <li>
                    <span className="relative mr-8">
                      <Icon
                        icon="icon-phone"
                        className="text-[24px] absolute mt-[5px]"
                      />
                    </span>
                    11-4177-6489
                  </li>
                  <li>
                    <span className="relative mr-8">
                      <img
                        className="text-[24px] absolute mt-[5px]"
                      />
                    </span>
                    example@gmail.com
                  </li>
                  <li>
                    <span className="relative mr-8">
                      <img src="/location.svg" alt=""
                        className="text-[24px] absolute mt-[5px] bg-red-500"
                      />
                    </span>
                    Cuenca 497 | Cuenca 683
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
}
