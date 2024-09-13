import { In } from 'typeorm';
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Color } from './entities/color.entity';
import { Size } from './entities/size.entity';
import { AddProductDto } from './dto/add-product.dto';
import { AddCategoryDto } from './dto/add-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Quantities } from 'src/common/enums';
import { ProductImage } from './entities/image.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
    @InjectRepository(Size)
    private readonly sizeRepository: Repository<Size>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async findAll() {
    return this.productRepository.find({
      relations: ['images', 'colors', 'sizes', 'categories'],
    });
  }

  async findProduct(slug: string) {
    return this.productRepository.findOne({
      where: { slug: slug },
      relations: ['images'],
    });
  }

  async findAllFeatured() {
    return this.productRepository.find({
      where: { featured: true },
      relations: ['images'],
    });
  }

  async findAllCategories() {
    return this.categoryRepository.find();
  }

  async findAllColors() {
    return this.colorRepository.find();
  }

  async findAllSizes() {
    return this.sizeRepository.find();
  }

  slugify(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '');
  }

  async addProduct(addProductDto: AddProductDto) {
    console.log('Received AddProductDto:', addProductDto);
    const existingProduct = await this.productRepository.findOne({
      where: { name: addProductDto.name },
    });

    if (existingProduct) {
      throw new ConflictException(
        `Product with name "${addProductDto.name}" already exists`,
      );
    }

    const colors = await this.colorRepository.find();
    const sizes = await this.sizeRepository.find();
    const categories = await this.categoryRepository.find();

    if (colors.length === 0 || sizes.length === 0 || categories.length === 0) {
      throw new ConflictException(
        `no hay suficientes datos para crear el producto`,
      );
    }

    const newProduct = {
      name: addProductDto.name,
      slug: this.slugify(addProductDto.name),
      description: addProductDto.description,
      stock: addProductDto.stock,
      price: addProductDto.price,
      offer: addProductDto.offer,
      quantity:
        addProductDto.quantity === 'ilimitado'
          ? Quantities.UNLIMITED
          : Quantities.LIMITED,
      categories: [categories[0], categories[1]],
      colors: [colors[0], colors[1]],
      sizes: [sizes[0], sizes[1]],
    };

    return newProduct;
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new Error('File not provided');
    }

    console.log(file);
    // Asegúrate de que el archivo se ha subido correctamente
    const filePath = `http://localhost:5001/files/${file.filename}`;

    // Devuelve la URL donde se podrá acceder al archivo
    return filePath;
  }

  async findCategory(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id }, // Buscar solo por el ID de la categoría
    });

    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      image: category.image,
    };
  }

  async deleteCategory(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return this.categoryRepository.remove(category);
  }

  async updateCategory(id: number, changes: UpdateCategoryDto) {
    // Busca la categoría por su ID
    const category = await this.categoryRepository.findOne({
      where: { id }, // Buscar por ID
    });

    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }

    // Actualiza los campos proporcionados en el DTO
    Object.assign(category, changes);

    // Guarda los cambios en la base de datos
    return await this.categoryRepository.save(category);
  }

  async addCategory(addCategoryDto: AddCategoryDto) {
    const slug = addCategoryDto.name
      .toLowerCase()
      .normalize('NFD') // Descompone los caracteres acentuados
      .replace(/[\u0300-\u036f]/g, '') // Elimina las marcas de acento
      .replace(/ñ/g, 'n') // Reemplaza la ñ por n
      .replace(/[^a-z0-9\s-]/g, '') // Elimina caracteres especiales
      .replace(/\s+/g, '-') // Reemplaza los espacios por guiones
      .replace(/-+/g, '-'); // Elimina guiones repetidos

    const newCategory = this.categoryRepository.create({
      name: addCategoryDto.name,
      slug: slug,
      image: 'http://localhost:5001/files/vestidos.jpg',
    });

    await this.categoryRepository.save(newCategory);

    return newCategory;
  }
}
