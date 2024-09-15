"use client";

import * as React from "react";
import { setCurrentCategory } from "@/store/slices/categorySlice";
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/input";
import { Save, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import useAdmin from "@/hooks/useAdmin"
import useCategories from "@/hooks/useCategories";
import MenuComponent from "@/app/dashboard/_components/menu"
import DrawerComponent from "@/app/dashboard/_components/drawer"
import { Tag, Globe, LayoutDashboard, NotepadText } from "lucide-react";

interface updateCategoryFormValues {
  name: string;
  description: string;
}

export default function EditCategory({ params }: any) {
  const dispatch = useAppDispatch();
  const { getCategory } = useCategories();
  const currentCategory = useAppSelector((state) => state.categories.currentCategory);

  const router = useRouter();
  const { updateCategory } = useAdmin();
  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
    reset,
    setValue,
  } = useForm<updateCategoryFormValues>({
    defaultValues: {
      name: "",
      description: "",
    },
    mode: "onChange",
  });

  React.useEffect(() => {
    getCategoryItem();
  }, []);

  React.useEffect(() => {
    if (currentCategory) {
      // Actualizar el valor del input 'name' cuando se obtiene la categoría
      setValue("name", currentCategory.name);
    }
  }, [currentCategory, setValue]);

  const onSubmit: SubmitHandler<updateCategoryFormValues> = async (data) => {
    try {
      if (currentCategory) {
        // Envía el objeto completo con nombre y descripción
        const response = await updateCategory(currentCategory.id, {
          name: data.name,
          description: data.description,
        });
        console.log(response);
        // Redirige a la página de categorías si es necesario
        router.push("/dashboard/categorias")
      }
    } catch (error: any) {
      console.log(error.response.data);
    }
  };

  // Función para limpiar los inputs
  const clearForm = () => {
    reset({
      name: "",
      description: "",
    });
  };

  const getCategoryItem = () => {
    getCategory(params.id).then((res) => {
      console.log("Category response:", res.data);
      if (res.data && 'id' in res.data && 'name' in res.data && 'slug' in res.data && 'image' in res.data) {
        // Almacenar la categoría actual en el estado
        dispatch(setCurrentCategory(res.data));
      } else {
        console.error("Invalid data format:", res.data);
      }
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
