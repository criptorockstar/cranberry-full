"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import useAuth from "@/hooks/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/input";

function SignUpForm() {
  const router = useRouter();
  const { signUp } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
    setError,
    getValues,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      password_confirmation: "",
    },
    mode: "onChange",
  });

  interface ServerErrors {
    email?: string;
    password?: string;
    password_confirmation?: string;
    [key: string]: string | undefined;
  }

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signUp(data.email, data.password, data.password_confirmation);
      router.push("/");
    } catch (error: any) {
      if (error.response && error.response.data.errors) {
        const serverErrors: ServerErrors = error.response.data.errors;

        const allowedFields = ["email", "password", "password_confirmation"] as const;

        for (const [field, message] of Object.entries(serverErrors)) {
          if (allowedFields.includes(field as typeof allowedFields[number])) {
            setError(field as "email" | "password" | "password_confirmation", {
              type: "manual",
              message: message || "",
            });
          }
        }
      } else {
        console.error("Ocurrió un error inesperado:", error);
      }
    }
  });

  return (
    <React.Fragment>
      <div
        className={`
      max-w-[418px] mx-auto mb-4
      font-bold text-[50px] leading-[68px]
      text-center lg:text-left`}
      >
        <div className="lg:text-left max-w-[418px] hidden lg:block">
          Registrarse
        </div>
      </div>

      <div className="max-w-[418px] mx-auto font-normal text-[18px] mb-4 text-center lg:text-left hidden lg:block">
        Si ya tienes una cuenta, puedes iniciar sesión aquí.
        <div>
          <Link href="/iniciar-sesion" className="text-[#0a1d35] underline">
            Iniciar sesión
          </Link>
        </div>
      </div>

      <div className="flex justify-center">
        <form className="w-full max-w-[408px]">
          <div className="w-full">
            <div className="mb-2 font-medium lg:text-[20px] xs:text-[18px]">
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
            <div className="mb-4 font-medium lg:text-[20px] xs:text-[18px]">
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

          <div className="mt-8">
            <div className="mb-4 font-medium lg:text-[20px] xs:text-[18px]">
              Confirme su contraseña
            </div>

            <Controller
              name="password_confirmation"
              control={control}
              rules={{
                required: "* Debe confirmar la contraseña",
                minLength: {
                  value: 6,
                  message: "* Debe tener al menos 6 caracteres",
                },
                validate: (value) =>
                  value === getValues("password") ||
                  "* Las contraseñas no coinciden",
              }}
              render={({ field }) => (
                <Input
                  error={
                    formErrors.password_confirmation
                      ? formErrors.password_confirmation.message
                      : ""
                  }
                  placeholder="Confirme su contraseña"
                  password={true}
                  {...field}
                />
              )}
            />
          </div>

          <div className="lg:w-full mt-12 xs:w-[230px] xs:mx-auto xs:mt-4">
            <Button
              onClick={onSubmit}
              className="bg-[#0a1d35] text-white w-full mt-8 mb-4 h-12 font-semibold text-[24px] py-8"
            >
              Crear cuenta
            </Button>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
}

export default SignUpForm;
