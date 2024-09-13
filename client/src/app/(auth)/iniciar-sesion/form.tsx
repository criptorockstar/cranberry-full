"use client";

import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import useAuth from "@/hooks/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/input";

interface SignInFormValues {
  email: string;
  password: string;
}

export default function SignInForm() {
  const router = useRouter();
  const { signIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
    setError,
  } = useForm<SignInFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<SignInFormValues> = async (data) => {
    try {
      await signIn(data.email, data.password);
      router.push("/");
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
  };

  return (
    <React.Fragment>
      <div
        className={`
        max-w-[400px] mx-auto mb-4
        font-bold text-[50px] leading-[68px]
        text-center lg:text-left`}
      >
        <div className="lg:text-left max-w-[400px] hidden lg:block">
          Iniciar Sesión
        </div>

        <div className="lg:hidden xs:block">
          <div className="flex justify-center">
            <Image
              src="/logo.svg"
              height={150}
              width={150}
              alt="Logo"
              className="xs:mb-[-60px] lg:mb-0 mt-[-20px]"
            />
          </div>
        </div>
      </div>

      <div className="max-w-[400px] mx-[20px] font-normal text-[18px] mb-4 text-center lg:text-left lg:hidden xs:block">
        <p className="text-[#0A1D35] py-4 font-medium text-[20px]">
          ¡Momento de iniciar sesión!
        </p>
      </div>

      <div className="max-w-[400px] mx-auto font-normal text-[18px] mb-4 text-center lg:text-left hidden lg:block">
        Si no tienes una cuenta, puedes crear una aquí.{" "}
        <Link href="/registrarse" className="text-[#0A1D35] underline">
          Registrarse ahora
        </Link>
      </div>

      <div className="flex justify-center">
        <form className="w-full max-w-[390px]">
          <div className="w-full">
            <div className="mb-2 font-medium text-[20px] hidden lg:block">
              Ingrese su correo electrónico
            </div>

            <Controller
              name="email"
              control={control}
              rules={{
                required: "* El correo no puede estar vacío",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "* Debe ser un correo válido",
                },
              }}
              render={({ field }) => (
                <Input
                  type="email"
                  placeholder="Correo electrónico"
                  error={formErrors.email ? formErrors.email.message : ""}
                  {...field}
                />
              )}
            />
          </div>

          <div className="mt-8">
            <div className="mb-4 font-medium text-[20px] hidden lg:block">
              Ingrese su contraseña
            </div>

            <Controller
              name="password"
              control={control}
              rules={{
                required: "* La contraseña no puede estar vacía",
                minLength: {
                  value: 6,
                  message: "* Debe tener al menos 6 caracteres",
                },
              }}
              render={({ field }) => (
                <Input
                  error={formErrors.password ? formErrors.password.message : ""}
                  placeholder="Contraseña"
                  password={true}
                  {...field}
                />
              )}
            />
          </div>

          <div className="mt-4 flex justify-end">
            <Link
              href="/recuperar-clave"
              className="text-right text-14 text-primary-500 hidden lg:block"
            >
              ¿Olvidaste tu clave?
            </Link>
          </div>

          <div className="lg:w-full mt-12 xs:w-[230px] xs:mx-auto xs:mt-4">
            <Button
              onClick={handleSubmit(onSubmit)}
              className="bg-[#0A1D35] text-white w-full h-12 font-semibold text-[24px] py-8"
            >
              Iniciar sesión
            </Button>
          </div>

          <div className="w-full justify-center text-center mt-8 xs:block lg:hidden">
            <Link href="/recuperar-clave" className="font-semibold underline">
              ¿Olvidaste tu clave?
            </Link>

            <div className="mb-4 mt-1">o</div>

            <div className="mt-2">
              <Link href="/registrarse" className="font-semibold underline">
                Crear una cuenta
              </Link>
            </div>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
}
