// Define a specific type for the category items in the DTO
export interface CategoryDto {
  value: string;
  label: string;
}

// Update AddProductDto to use the CategoryDto type
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  Allow,
} from 'class-validator';

export class UpdateProductDto {
  @IsNotEmpty({ message: 'name: Debe ingresar un nombre' })
  @IsString({ message: 'name: Debe ser una cadena de texto' })
  name: string;

  @IsNotEmpty({ message: 'description: Debe ingresar una descripción' })
  @IsString({ message: 'description: Debe ser una cadena de texto' })
  description: string;

  @IsArray({ message: 'categories: Debe ingresar una o más categorías' })
  @ArrayNotEmpty({
    message: 'categories: Debe ingresar al menos una categoría',
  })
  categories: CategoryDto[];

  @IsNotEmpty({ message: 'quantity: Debe ingresar una cantidad' })
  @IsString({ message: 'quantity: Debe ser una cadena de texto' })
  quantity: string;

  @IsNotEmpty({ message: 'stock: Debe ingresar el stock' })
  @IsNumber({}, { message: 'stock: Debe ser un número' })
  stock: number;

  @IsNotEmpty({ message: 'price: Debe ingresar el precio' })
  @IsNumber({}, { message: 'price: Debe ser un número' })
  price: number;

  @IsNotEmpty({ message: 'offer: Debe ingresar la oferta' })
  @IsNumber({}, { message: 'offer: Debe ser un número' })
  offer: number;

  @Allow()
  featured: boolean;

  @IsArray()
  images: any;

  @IsArray({ message: 'colors: Debe ser una lista de colores' })
  @ArrayNotEmpty({ message: 'colors: Debe ingresar al menos un color' })
  colors: string[];

  @IsArray({ message: 'sizes: Debe ser una lista de tamaños' })
  @ArrayNotEmpty({ message: 'sizes: Debe ingresar al menos un tamaño' })
  sizes: string[];
}
