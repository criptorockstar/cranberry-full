"use client";

import React, { useRef, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Trash2, Star, CirclePlus, StarOff } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import Select from 'react-select';
import useCategories from "@/hooks/useCategories";
import useColors from "@/hooks/useColors";
import useSizes from "@/hooks/useSizes";

import { setCategories } from "@/store/slices/categorySlice";
import { setColors } from "@/store/slices/colorSlice";
import { setSizes } from "@/store/slices/sizeSlice";
import { useAppDispatch, useAppSelector } from '@/store/store';
import useAdmin from "@/hooks/useAdmin";
import MenuComponent from "../_components/menu";
import DrawerComponent from "../_components/drawer";
import { Tag, Globe, LayoutDashboard, NotepadText } from "lucide-react";

interface AddProductFormValues {
  name: string;
  description: string;
  images: File[];
  price: number;
  offer: number;
  quantity: "ilimitado" | "limitado";
  featured: boolean;
  stock: number;
  categories: { value: string, label: string }[];
  colors: string[];
  sizes: string[];
}

export default function AddProduct() {
  const router = useRouter();
  const { createProduct, uploadImage } = useAdmin();
  const { getColors } = useColors();
  const { getSizes } = useSizes();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();
  const { getCategories } = useCategories();
  const categories = useAppSelector((state) => state.categories.categories);
  const colors = useAppSelector((state) => state.colors.colors);
  const sizes = useAppSelector((state) => state.sizes.sizes);

  const [images, setImages] = useState<File[]>([]);
  const [imageObject, setImageObject] = useState<string[]>([]); // Cambia 'any' a 'string[]'
  const [imageError, setImageError] = useState<string | null>(null);
  const [colorError, setColorError] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [quantityOptions, setQuantityOptions] = useState("ilimitado");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [featuredObject, setFeaturedObject] = useState(false);

  React.useEffect(() => {
    getCategoryList();
    getColorList();
    getSizeList();
  }, []);

  const getCategoryList = () => {
    getCategories().then((res) => {
      console.log("Category list response:", res.data);
      if (Array.isArray(res.data) && res.data.every(item => 'id' in item && 'name' in item && 'slug' in item && 'image' in item)) {
        dispatch(setCategories(res.data));
      } else {
        console.error("Invalid data format:", res.data);
      }
      dispatch(setCategories(res.data));
    });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedColor = e.target.value;
    setSelectedColors(prevColors =>
      e.target.checked
        ? [...prevColors, selectedColor]
        : prevColors.filter(c => c !== selectedColor)
    );
    setColorError(null);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedSize = e.target.value;
    setSelectedSizes(prevSizes =>
      e.target.checked
        ? [...prevSizes, selectedSize]
        : prevSizes.filter(s => s !== selectedSize)
    );
    setSizeError(null);
  };


  const getColorList = () => {
    getColors().then((res) => {
      console.log("Color list response:", res.data);
      if (Array.isArray(res.data) && res.data.every(item => 'id' in item && 'name' in item && 'code' in item)) {
        dispatch(setColors(res.data));
      } else {
        console.error("Invalid data format:", res.data);
      }
    });
  };

  const getSizeList = () => {
    getSizes().then((res) => {
      console.log("Size list response:", res.data);
      if (Array.isArray(res.data) && res.data.every(item => 'id' in item && 'name' in item)) {
        dispatch(setSizes(res.data));
      } else {
        console.error("Invalid data format:", res.data);
      }
    });
  };

  const toggleFeatured = () => {
    setFeaturedObject(!featuredObject);
    setValue("featured", !featuredObject);
  }

  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
    setError,
    setValue,
  } = useForm<AddProductFormValues>({
    defaultValues: {
      name: "",
      description: "",
      images: [],
      price: 0,
      offer: 0,
      quantity: "ilimitado",
      featured: false,
      stock: 0,
      categories: [],
      colors: [],
      sizes: [],
    },
    mode: "onChange",
  });


  const validateImages = () => {
    // Suponiendo que 'images' es parte del estado o una variable
    if (images.length == 0) {
      setImageError("Debes subir al menos una imagen");
      // Enfocar el input cuando no hay imágenes
      if (fileInputRef.current) {
        fileInputRef.current.focus();
      }
      return;
    }
    setImageError('');
  };


  const onSubmit: SubmitHandler<AddProductFormValues> = async data => {
    validateImages();

    if (imageError) {
      return; // Detener el envío si hay un error
    }

    if (selectedColors.length == 0) {
      setColorError("* Debes seleccionar al menos un color");
      console.log("empty colors")
      return;
    }

    if (selectedSizes.length == 0) {
      setSizeError("* Debes seleccionar al menos un talle");
      return;
    }

    const formdata = {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      offer: data.offer,
      stock: data.stock,
      featured: data.featured,
      quantity: data.quantity,
      categories: data.categories,
      featuredproduct: data.featured,
      colors: selectedColors,
      images: [...imageObject],
      sizes: selectedSizes
    }

    try {
      await createProduct(formdata);
      router.push("/dashboard")
    } catch (error: any) {
      if (error.response && error.response.data.errors) {
        const serverErrors = error.response.data.errors as Record<string, string>;
        for (const [field, message] of Object.entries(serverErrors)) {
          if (field) {
            setError(field as keyof AddProductFormValues, {
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      if (images.length + files.length > 3) {
        setImageError("Puedes subir un máximo de 3 imágenes.");
        return;
      }
      setImageError(null);
      setImages(prevImages => [...prevImages, ...files].slice(0, 4));  // Máximo 4 imágenes

      // Subir imágenes y extraer las URLs
      const imgResponses = await Promise.all(files.map(file => uploadImage(file)));
      const imageUrls = imgResponses.map(response => response.imageUrl);

      // Acumular las nuevas URLs en el estado de imageObject
      setImageObject(prev => [...prev, ...imageUrls]); // Añadir sin reemplazar

      console.log("Estado completo de URLs:", [...imageObject]);
    }
  };

  const handleDeleteImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));  // Eliminar la imagen del estado de imágenes
    setImageObject(prevObjects => prevObjects.filter((_, i) => i !== index));  // Eliminar la URL correspondiente
  };

  const handleQuantityChange = (value: "ilimitado" | "limitado") => {
    setQuantityOptions(value);
    return value
  }

  const items = [
    { slug: "/dashboard", text: "Productos", icon: <Tag size={20} />, active: true },
    { slug: "/dashboard/categorias", text: "Categorias", icon: <LayoutDashboard size={20} /> },
    { slug: "/dashboard/pedidos", text: "Pedidos", icon: <NotepadText size={20} /> },
    { slug: "/", text: "Ir al sitio Web", icon: <Globe size={20} /> },
  ];

  return (
    <React.Fragment>
      <DrawerComponent items={items} />
      <div className="px-4 sm:px-8">
        <div className="font-semibold text-2xl mt-2">
          <div className="flex flex-row items-center">
            <div>
              <MenuComponent />
            </div>
            <div>Agregar producto</div>
          </div>

          <div className="mt-2 flex flex-row justify-end items-center gap-4">
            <Button size="icon" className="bg-[#0a1d35]" onClick={handleSubmit(onSubmit)}>
              <Save />
            </Button>
            <Button size="icon" className="bg-[#0a1d35]">
              <Trash2 />
            </Button>

            <Button
              onClick={toggleFeatured}
              size="icon" className="bg-[#0a1d35]" style={{ color: '#fff' }}>
              {featuredObject ? (
                <Star color="#fff700" strokeWidth={1.75} />
              ) : (
                <StarOff color="#f00" />
              )}
            </Button>
          </div>
        </div>
      </div>
      <div className="p-6 bg-[#f0f0f0]">
        <div className="flex flex-row xl:gap-8 xl:h-[88%]">
          <div className="w-full flex-grow">
            <div className="text-2xl">
              Información
            </div>
            <div className="mt-3 p-4 bg-white rounded-xl">
              <div className="mb-2">Nombre del artículo</div>
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
                    placeholder="Artículo"
                    error={formErrors.name ? formErrors.name.message : ""}
                    {...field}
                  />
                )}
              />

              <div className="mt-4">Descripción</div>
              <Controller
                name="description"
                control={control}
                rules={{ required: "* La descripción no puede estar vacía" }}
                render={({ field }) => (
                  <Textarea
                    className="bg-[#f0f0f0]"
                    placeholder="Descripción del artículo"
                    rows={4}
                    {...field}
                    error={formErrors.description ? formErrors.description.message : ""}
                  />
                )}
              />
            </div>

            <div className="mt-6 text-xl">Fotos</div>
            <div className="mt-2 p-4 bg-white rounded-xl flex flex-col ">

              {/* Contenedor para subir nuevas imágenes */}
              <div className="relative w-full xl:w-[150px] h-[150px] border-2 border-dashed border-gray-400 flex items-center justify-center rounded-md cursor-pointer">
                <input
                  name="pictures"
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  multiple
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                />
                <CirclePlus size={48} className="text-gray-500" />
                <div className="absolute bottom-0 mb-0">
                  {imageError && (
                    <div className="text-red-500 text-center">{imageError}</div>
                  )}
                </div>
              </div>

              {/* Contenedor para mostrar imágenes subidas */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ">
                {images.map((image, index) => (
                  <div key={index} className="relative bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Imagen subida"
                      className="h-full w-full object-cover"
                    />
                    {/* Botón para eliminar la imagen */}
                    <Button
                      size="icon"
                      className="rounded-full absolute top-2 right-2 bg-white text-red-500"
                      style={{ height: "40px", width: "40px" }}
                      onClick={() => handleDeleteImage(index)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 text-xl">Precios</div>
            <div className="mt-3 p-4 px-8 bg-white rounded-xl">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <div className="mb-2">Precio</div>
                  <div className="relative">
                    <span className="absolute z-20 left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Controller
                      name="price"
                      control={control}
                      rules={{
                        required: "* El precio no puede estar vacío",
                      }}
                      render={({ field }) => (
                        <Input
                          className="bg-[#f0f0f0] pl-8" // Dejar espacio para el símbolo de dólar
                          type="text"
                          placeholder="0"
                          error={formErrors.price ? formErrors.price.message : ""}
                          {...field}
                        />
                      )}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2">Oferta</div>
                  <div className="relative">
                    <span className="absolute z-20 left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Controller
                      name="offer"
                      control={control}
                      render={({ field }) => (
                        <Input
                          className="bg-[#f0f0f0] pl-8" // Dejar espacio para el símbolo de dólar
                          type="text"
                          placeholder="0"
                          {...field}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-xl">Stock</div>
            <div className="mt-3 p-8 pt-11  bg-white rounded-xl flex flex-col xl:flex-row">
              <Controller
                name="quantity"
                control={control}
                rules={{ required: "* Debes seleccionar una opción de stock" }}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleQuantityChange(value as "ilimitado" | "limitado");
                    }}
                    value={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ilimitado" id="ilimitado" />
                      <label htmlFor="ilimitado">Ilimitado</label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="limitado" id="limitado" />
                      <label htmlFor="limitado">Limitado</label>
                    </div>
                  </RadioGroup>
                )}
              />
              <div className="flex items-center mt-8 ml-8">
                <Controller
                  name="stock"
                  control={control}
                  rules={{
                    required: "* El stock no puede estar vacío",
                  }}
                  render={({ field }) => (
                    <Input
                      disabled={quantityOptions === "ilimitado"}
                      className="bg-[#f0f0f0]"
                      type="text"
                      placeholder="0"
                      error={formErrors.stock ? formErrors.stock.message : ""}
                      {...field}
                    />
                  )}
                />
                <div className="-mt-6 ml-4">Unidades</div>
              </div>
            </div>

            <div className="mt-6 text-xl">Categorias</div>
            <div className="mt-3 p-4 pt-7 bg-white rounded-xl">
              <Controller
                name="categories"
                control={control}
                rules={{
                  required: "* Categoria no puede estar vacío",
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    isMulti
                    options={categories.map(category => ({ value: String(category.id), label: category.name }))}
                    classNamePrefix="react-select"
                    placeholder="Selecciona categorías"
                    onChange={(selectedOptions) => {
                      field.onChange(selectedOptions);
                    }}
                    value={categories
                      .filter(category =>
                        field.value?.map(v => String(v.value)).includes(String(category.id))
                      )
                      .map(category => ({ value: String(category.id), label: category.name }))}
                  />
                )}
              />
              <div className="mb-3"></div>
            </div>

            <div className="mt-6 text-xl">Colores</div>
            <div className="mt-4 p-4 pt-8 bg-white rounded-xl">
              <div className="flex flex-row flex-wrap">
                {colors.map((color) => (
                  <div key={color.id} className="flex flex-col items-center mb-4 mx-2">
                    <div
                      className="w-[40px] h-[40px] rounded-none"
                      style={{ backgroundColor: color.code }}
                    ></div>
                    <div className="p-1"></div>
                    <input
                      type="checkbox"
                      id={`color-${color.id}`}
                      value={color.name}
                      onChange={handleColorChange}
                    />
                  </div>
                ))}
              </div>
              {colorError && <p className="text-red-500 mt-[-10px] text-xs">{colorError}</p>}
            </div>

            <div className="mt-6 text-xl">Talles</div>
            <div className="mt-4 p-4 pt-8 bg-white rounded-xl">
              <div className="flex flex-row flex-wrap">
                <div className="flex flex-row flex-wrap">
                  {sizes.map((size) => (
                    <div key={size.id} className="flex flex-col items-center mb-4 mx-2">
                      <div
                        className="w-[40px] h-[40px] rounded-none bg-[black] text-white"
                      >
                        <div className="flex items-center justify-center h-full">
                          {size.name}
                        </div>
                      </div>

                      <div className="p-1"></div>
                      <input
                        type="checkbox"
                        id={`color-${size.id}`}
                        value={size.name}
                        onChange={handleSizeChange}
                      />
                    </div>
                  ))}
                </div>
              </div>
              {sizeError && <p className="text-red-500 mt-[-10px] text-xs">{sizeError}</p>}
            </div>
          </div>

          <div className="w-[100px] hidden xl:block">
            <div className="xl:grid grid-cols-2 fixed">
              <div className="mr-1">
                <Button size="icon" className="bg-[#0a1d35]" onClick={handleSubmit(onSubmit)}>
                  <Save />
                </Button>
              </div>

              <div className="flex flex-col space-y-[5px]">
                <Button size="icon" className="bg-[#0a1d35]">
                  <Trash2 />
                </Button>

                <Button
                  onClick={toggleFeatured}
                  size="icon" className="bg-[#0a1d35]" style={{ color: '#fff' }}>
                  {featuredObject ? (
                    <Star color="#fff700" strokeWidth={1.75} />
                  ) : (
                    <StarOff color="#f00" />
                  )}
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </React.Fragment>
  );
}
