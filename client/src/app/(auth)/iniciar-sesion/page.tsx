"use client"

import React from "react";
import useAuth from "@/hooks/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/input";

import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"


import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

interface SignInFormValues {
  email: string;
  password: string;
}

const FormSchema = z.object({
  email: z.string().min(1, {
    message: "El correo electronico es requerido",
  }),
  password: z.string().min(1, {
    message: "Debe ingresar una contraseña",
  }),
})


export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useAuth();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  })

  const { setError } = form;

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await signIn(data.email, data.password);
      window.location.href = "/";
    } catch (error: any) {
      if (error.response && error.response.data.errors) {
        const serverErrors = error.response.data.errors as Record<string, string>;
        for (const [field, message] of Object.entries(serverErrors)) {
          if (field) {
            setError(field as keyof SignInFormValues, {
              type: "manual",
              message: message || "",
            });
          }
        }
      } else {
        console.error("Ocurrió un error inesperado:", error);
      }
    }
  }

  return (
    <React.Fragment>
      <div className="grid lg:grid-cols-12 grid-cols-1 h-screen bg-[#f0f0f0]">
        <div className="bg-[url('/auth.png')] bg-no-repeat min-h-[100px] xl:col-span-7 hidden xl:flex bg-cover rounded-tr-3xl rounded-br-3xl"></div>

        <div className="min-h-[100px] xl:col-span-5 col-span-12">
          <div className="absolute right-4 top-4 xl:hidden">
            <div className="flex flex-row">
              <div className="font-weight-500 text-[26px] leading-[22px] mt-2 text-[#0A1D35]">Iniciar Sesion</div>
              <div><img src="/lock.svg" className="w-10" /></div>
            </div>
          </div>
          <div className="w-full h-full flex items-center justify-center xl:justify-normal">
            <div className="w-full max-w-[390px] lg:mx-10 mx-4">
              <div className="mb-14">
                <h1 className="font-weight-700 text-[50px] hidden xl:block">
                  Iniciar Sesión
                </h1>

                <div className="text-[18px] font-weight-400 hidden xl:block">
                  Si no tienes una cuenta, puedes crear una aquí. <Link href="" className="font-weight-400 text-[#188DF9]">Registrarse ahora</Link>
                </div>

                <div className="flex flex-col justify-center -mb-8 xl:hidden">
                  <img src="/logo.svg" width={250} className="mx-auto" />
                  <div className="text-center -mt-10 font-weight-500 text-[20px] text-[#0A1D35]">
                    ¡Momento de iniciar sesión!
                  </div>
                </div>
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="relative">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel><p className="font-weight-500 text-[20px] hidden xl:block">Ingrese su correo electronico</p></FormLabel>
                          <FormControl>
                            <Input placeholder="Correo electronico" {...field} className="py-7 bg-white px-5 text-[18px] border  border-[#0A1D35]" />
                          </FormControl>
                          <FormMessage className="select-none absolute -bottom-6" />
                        </FormItem>
                      )}>
                    </FormField>
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel><p className="font-weight-500 text-[20px] hidden xl:block">Ingrese su contraseña</p></FormLabel>
                          <FormControl>
                            <Input placeholder="Contraseña" {...field} password={true} className="relative py-7 bg-white px-5 text-[18px] border  border-[#0A1D35]" />
                          </FormControl>
                          <FormMessage className="select-none absolute" />
                        </FormItem>
                      )}>
                    </FormField>
                    <div className="float-right mt-2 hidden xl:block">
                      <Link href="" className="text-[#188DF9] gont-weight-400 text-[16px]">¿Olvidaste tu clave?</Link>
                    </div>
                  </div>
                  <div className="pt-4 xl:pt-0 mx-8 xl:mx-0  bg-[#f0f0f0]">
                    <Button type="submit" className="bg-[#0A1D35] w-full py-8 select-none">Iniciar sesión</Button>

                    <div className="xl:hidden mt-5">
                      <div className="text-center">
                        <Link href="" className="underline">¿Olvidaste la contraseña?</Link>
                      </div>
                      <div className="text-center mt-2">o</div>
                      <div className="text-center">
                        <Link href="" className="underline">Crear una cuenta</Link>
                      </div>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div >
      </div >
    </React.Fragment >
  );
}

