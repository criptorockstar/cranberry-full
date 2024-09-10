"use client";

import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import useAuth from "@/hooks/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/input";
import { Save, Trash2, Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea"

interface addProductFormValues {
  name: string;
  description: string;
}

export default function AddCategory() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
    setError,
  } = useForm<addProductFormValues>({
    defaultValues: {
      name: "",
      description: "",
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<addProductFormValues> = data => {
    console.log(data);
  };

  return (
    <React.Fragment>
      <div className="p-6">
        <div className="flex flex-row justify-between">
          <div>
            <div className="font-semibold text-2xl">Categorias</div>
            <p>Crea categorías para organizar tus productos y tener un mejor control de lo que vendes.</p>
          </div>

          <div className="flex flex-row space-x-2">
            <Button size="icon">
              <Trash2 />
            </Button>

            <Button className="">
              <Save />
              <span className="ml-1">Guardar</span>
            </Button>
          </div>
        </div>

        <div className="mt-6 flex flex-row">
          <div className="w-full flex-grow">
            <div className="mt-3 p-4 bg-white rounded-xl">
              <div className="mb-2">Nombre de la categoria</div>

              <Controller
                name="name"
                control={control}
                rules={{
                  required: "* El nombre no puede estar vacío",
                }}
                render={({ field }) => (
                  <Input
                    className="bg-[#f0f0f0]"
                    type="email"
                    placeholder="Articulo"
                    error={formErrors.name ? formErrors.name.message : ""}
                    {...field}
                  />
                )}
              />

              <div className="">Descripcion (opcional)</div>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    className="bg-[#f0f0f0]"
                    placeholder="Descripción"
                    rows={4}
                    {...field}
                  />
                )}
              />
            </div>

          </div>
        </div>
      </div>
    </React.Fragment>

  );
}

