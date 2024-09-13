import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class AddCategoryDto {
  @IsNotEmpty({ message: 'name: Debe ingresar un nombre' })
  @IsString({ message: 'name: Debe ser una cadena de texto' })
  name: string;

  @IsOptional()
  @IsString({ message: 'description: Debe ser una cadena de texto' })
  description?: string;
}
