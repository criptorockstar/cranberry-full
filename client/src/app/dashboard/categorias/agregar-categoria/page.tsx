"use client";

import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/input";
import { Save, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import useAdmin from "@/hooks/useAdmin"
import { useRouter } from "next/navigation";
import MenuComponent from "@/app/dashboard/_components/menu"
import DrawerComponent from "@/app/dashboard/_components/drawer"
import { Tag, Globe, LayoutDashboard, NotepadText } from "lucide-react";

interface addCategoryFormValues {
  name: string;
  description: string;
}

export default function AddCategory() {
  const router = useRouter();
  const { createCategory } = useAdmin();
  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
    reset,
  } = useForm<addCategoryFormValues>({
    defaultValues: {
      name: "",
      description: "",
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<addCategoryFormValues> = async (data) => {
    try {
      await createCategory(data.name);
      router.push("/dashboard/categorias")
    } catch (error: any) {
      console.log(error.response.data)
    }
  };

  // Función para limpiar los inputs
  const clearForm = () => {
    reset({
      name: "",
      description: "",
    });
  };

  const items = [
    { slug: "/dashboard", text: "Productos", icon: <Tag size={20} />, active: true },
    { slug: "/dashboard/categorias", text: "Categorias", icon: <LayoutDashboard size={20} /> },
    { slug: "/dashboard/pedidos", text: "Pedidos", icon: <NotepadText size={20} /> },
    { slug: "/", text: "Ir al sitio Web", icon: <Globe size={20} /> },
  ];

  return (
    <React.Fragment>
      <DrawerComponent items={items} />
      <div className="p-6">
        <div className="flex flex-col xl:flex-row justify-between">
          <div>
            <div className="font-semibold text-2xl flex flex-row items-center">
              <div>
                <MenuComponent />
              </div>
              <div>Categorias</div>
            </div>
            <p>
              Crea categorías para organizar tus productos y tener un mejor
              control de lo que vendes.
            </p>
          </div>

          <div className="flex flex-row space-x-2 xl:mt-0 mt-4">
            {/* Botón para limpiar el formulario */}
            <Button size="icon" onClick={clearForm}>
              <Trash2 />
            </Button>

            {/* Botón para guardar el formulario */}
            <Button className="" onClick={handleSubmit(onSubmit)}>
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
                    type="text"
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
