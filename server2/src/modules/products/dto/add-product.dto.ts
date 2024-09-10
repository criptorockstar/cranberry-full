import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class AddProductDto {
  @IsNotEmpty({ message: 'name: Debe ingresar un nombre' })
  @IsString({ message: 'name: Debe ser una cadena de texto' })
  name: string;

  @IsNotEmpty({ message: 'description: Debe ingresar una descripción' })
  @IsString({ message: 'description: Debe ser una cadena de texto' })
  description: string;

  @IsNotEmpty({ message: 'category: Debe ingresar una categoría' })
  category: number;

  @IsNotEmpty({ message: 'stock: Debe ingresar el stock' })
  @IsNumber({}, { message: 'stock: Debe ser un número' })
  stock: number;

  @IsNotEmpty({ message: 'price: Debe ingresar el precio' })
  @IsNumber({}, { message: 'price: Debe ser un número' })
  price: number;

  @IsNotEmpty({ message: 'discount: Debe ingresar el descuento' })
  @IsNumber({}, { message: 'discount: Debe ser un número' })
  discount: number;

  @IsArray({ message: 'colors: Debe ser una lista de colores' })
  @ArrayNotEmpty({ message: 'colors: Debe ingresar al menos un color' })
  colors: string[];

  @IsArray({ message: 'sizes: Debe ser una lista de tamaños' })
  @ArrayNotEmpty({ message: 'sizes: Debe ingresar al menos un tamaño' })
  sizes: string[];
}
