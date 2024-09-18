"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { setCategories } from "@/store/slices/categorySlice";
import useCategories from "@/hooks/useCategories";
import useColors from "@/hooks/useColors";
import { RangeSlider } from "@/components/range-slider"
import { setColors } from "@/store/slices/colorSlice"
import { setSizes } from "@/store/slices/sizeSlice";
import useSizes from "@/hooks/useSizes"

export default function Filters() {
  const dispatch = useAppDispatch();
  const { getCategories } = useCategories();
  const { getColors } = useColors();
  const { getSizes } = useSizes();

  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [range, setRange] = React.useState<[number, number]>([0, 0])
  const [selectedColors, setSelectedColors] = React.useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = React.useState<string[]>([]);

  const categories = useAppSelector((state) => state.categories.categories);
  const colors = useAppSelector((state) => state.colors.colors);
  const sizes = useAppSelector((state) => state.sizes.sizes)

  const handleRangeChange = (newRange: [number, number]) => {
    setRange(newRange)
  }

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

  const getColorList = () => {
    getColors().then((res) => {
      console.log("Colorlist response:", res.data);
      dispatch(setColors(res.data));
    });
  };

  const getSizeList = () => {
    getSizes().then((res) => {
      console.log("Sizelist response:", res.data);
      dispatch(setSizes(res.data));
    });
  };

  const handleCategoryChange = (categoryId: any, isChecked: any) => {
    setSelectedCategories((prevSelected) => {
      const updatedSelection = isChecked
        ? [...prevSelected, categoryId]
        : prevSelected.filter((id) => id !== categoryId);

      console.log("Selected Categories:", updatedSelection);
      return updatedSelection;
    });
  };

  const handleColorChange = (colorId: any, isChecked: any) => {
    setSelectedColors((prevSelected) => {
      const updatedSelection = isChecked
        ? [...prevSelected, colorId]
        : prevSelected.filter((id) => id !== colorId);

      console.log("Selected Colors:", updatedSelection);

      return updatedSelection;
    });
  };

  const handleSizeChange = (sizeId: any, isChecked: any) => {
    setSelectedSizes((prevSelected) => {
      const updatedSelection = isChecked
        ? [...prevSelected, sizeId]
        : prevSelected.filter((id) => id !== sizeId);

      console.log("Selected Sizes:", updatedSelection);

      return updatedSelection;
    });
  };

  return (
    <React.Fragment>
      <Accordion type="multiple" className="w-full" defaultValue={["item-1", "item-2", "item-3", "item-4"]}>
        <AccordionItem value="item-1">
          <AccordionTrigger><span className="text-[20px] font-weight-700">Categorías</span></AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col">
              {categories.map((category) => (
                <div key={category.id} className="pb-5">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      onCheckedChange={(isChecked) =>
                        handleCategoryChange(category.id, isChecked)
                      }
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="text-sm font-semibold select-none leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger><span className="text-[20px] font-weight-700">Filtrar por precios</span></AccordionTrigger>
          <AccordionContent>
            <div className="mt-4">
              <div className="mb-4">
                Precio: ${range[0]} - ${range[1]}
              </div>
              <RangeSlider
                value={range}
                onValueChange={handleRangeChange}
                min={0}
                max={10000}
                className="w-full max-w-md"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger><span className="text-[20px] font-weight-700">Colores</span></AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col">
              {colors.map((color) => (
                <div key={color.id} className="pb-5">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`color-${color.id}`}
                      onCheckedChange={(isChecked) =>
                        handleColorChange(color.id, isChecked)
                      }
                    />
                    <label
                      htmlFor={`color-${color.id}`}
                      className="text-sm font-semibold select-none leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {color.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger><span className="text-[20px] font-weight-700">Talles</span></AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col">
              {sizes.map((size) => (
                <div key={size.id} className="pb-5">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`size-${size.id}`}
                      onCheckedChange={(isChecked) =>
                        handleSizeChange(size.id, isChecked)
                      }
                    />
                    <label
                      htmlFor={`size-${size.id}`}
                      className="text-sm font-semibold select-none leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {size.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </React.Fragment>
  );
}
