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
import useAdmin from "@/hooks/useAdmin"
import { Image, Size, Category } from '@/store/slices/productSlice';
import { setCurrentProduct } from "@/store/slices/productSlice";
import useProducts from "@/hooks/useProducts";
import MenuComponent from "@/app/dashboard/_components/menu";
import DrawerComponent from "@/app/dashboard/_components/drawer";
import { Tag, Globe, LayoutDashboard, NotepadText } from "lucide-react";

interface Color {
  id: number;
  name: string;
  code: string;
}

interface updateProductFormValues {
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

export default function EditProduct({ params }: any) {
  const router = useRouter();
  const { updateProduct, uploadImage } = useAdmin();
  const { getProduct } = useProducts();
  const { getColors } = useColors();
  const { getSizes } = useSizes();
  const { getCategories } = useCategories();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentProduct = useAppSelector((state) => state.products.currentProduct);

  const dispatch = useAppDispatch();

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

  const toggleFeatured = () => {
    setFeaturedObject(!featuredObject);
    setValue("featured", !featuredObject);
  }

  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
    reset,
    setError,
    setValue,
    clearErrors,
    register,
  } = useForm<updateProductFormValues>({
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

  React.useEffect(() => {
    if (currentProduct) {
      setValue("name", currentProduct.name);
      setValue("description", currentProduct.description);
      setValue("price", currentProduct.price);
      setValue("offer", currentProduct.offer);
      setValue("stock", currentProduct.stock);
      setValue("featured", currentProduct.featured);
      setFeaturedObject(currentProduct.featured)
      setValue("quantity", currentProduct?.quantity as "ilimitado" | "limitado")
      setQuantityOptions(currentProduct?.quantity);

      // Cargar imágenes en el estado
      if (currentProduct.images && currentProduct.images.length > 0) {
        const imageFiles = currentProduct.images.map((img) => {
          const file = new File([img.url], img.id.toString(), { type: "image/jpeg" }); // Convertimos 'img.id' a string
          return file;
        });
        const imageUrls = currentProduct.images.map((img) => img.url);

        setImages(imageFiles);  // Actualiza el estado de imágenes como archivos
        setImageObject(imageUrls);  // Actualiza el estado de las URLs de imágenes
      }

      // Mapear categorías
      if (currentProduct.categories && currentProduct.categories.length > 0) {
        const categoryOptions = currentProduct.categories.map((category) => ({
          value: category.id.toString(), // Asegúrate de convertir ID a string
          label: category.name,
        }));

        setValue("categories", categoryOptions); // Establecer los valores de las categorías en el formulario
      }


      // Mapear colores
      if (currentProduct.colors && currentProduct.colors.length > 0) {
        setSelectedColors(currentProduct.colors.map((color) => color.name));
      }

      // Mapear tamaños
      setSelectedSizes(currentProduct.sizes.map((size) => size.name));

    }
  }, [currentProduct, setValue]);

  React.useEffect(() => {
    getProductItem();
    getCategoryList();
    getColorList();
    getSizeList();
  }, []);


  const getProductItem = () => {
    getProduct(params.id).then((res) => {
      console.log("Product response:", res.data);
      if (res.data && 'id' in res.data && 'name' in res.data) {
        const formattedProduct = {
          id: res.data.id,
          name: res.data.name,
          slug: res.data.slug,
          description: res.data.description,
          stock: res.data.stock,
          price: res.data.price,
          quantity: res.data.quantity,
          offer: res.data.offer,
          featured: res.data.featured,
          createdAt: res.data.createdAt,
          updatedAt: res.data.updatedAt,
          images: res.data.images.map((image: any): Image => ({
            id: image.id,
            url: image.url,
          })),
          colors: res.data.colors.map((color: any): Color => ({
            id: color.id,
            name: color.name,
            code: color.code,
          })),
          sizes: res.data.sizes.map((size: any): Size => ({
            id: size.id,
            name: size.name,
          })),
          categories: res.data.categories.map((category: any): Category => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            image: category.image,
          })),
        };

        // Almacenar el producto actual en el estado
        dispatch(setCurrentProduct(formattedProduct));
      } else {
        console.error("Invalid product data format:", res.data);
      }
    });
  };

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      if (images.length + files.length > 4) {
        setImageError("Puedes subir un máximo de 4 imágenes.");
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

  const onSubmit: SubmitHandler<updateProductFormValues> = async data => {
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
      quantity: data.quantity,
      categories: data.categories,
      colors: selectedColors,
      images: [...imageObject],
      sizes: selectedSizes
    }

    try {
      await updateProduct(params.id, formdata);
      router.push("/dashboard")
    } catch (error: any) {
      if (error.response && error.response.data.errors) {
        const serverErrors = error.response.data.errors as Record<string, string>;
        for (const [field, message] of Object.entries(serverErrors)) {
          if (field) {
            setError(field as keyof updateProductFormValues, {
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
            <div>Editar producto</div>
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
        <div className="flex flex-row gap-8 h-[88%]">
          <div className="w-full flex-grow">
            <div className="text-2xl">Información</div>
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
            <div className="mt-2 p-4 bg-white rounded-xl flex-row">
              <div className="relative h-[150px] w-[150px] border-2 border-dashed border-gray-400 flex items-center justify-center rounded-md cursor-pointer">
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

              <div className="mt-4 flex flex-row gap-4 flex-wrap">
                {imageObject.map((imageUrl, index) => (
                  <div key={index} className="relative h-[150px] w-[150px] bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={imageUrl}
                      alt="Imagen subida"
                      className="h-full w-full object-cover"
                    />

                    {/* Botón para eliminar la imagen */}
                    <Button
                      size="icon"
                      className="rounded-full absolute inset-0 m-auto bg-white text-red-500"
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
            <div className="mt-4 p-4 pt-8 bg-white rounded-none">
              <div className="flex flex-row flex-wrap">
                {colors.map((color) => (
                  <div key={color.id} className="flex flex-col items-center mb-4 mx-2">
                    <div
                      className="w-[40px] h-[40px] rounded-none"
                      style={{ backgroundColor: color.code }}
                    ></div>
                    <div className="p-1"></div>
                    <label htmlFor={`color-${color.id}`} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id={`color-${color.id}`}
                        value={color.name}
                        checked={selectedColors.includes(color.name)}
                        onChange={handleColorChange}
                      />
                    </label>
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
                        checked={selectedSizes.includes(size.name)}
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
