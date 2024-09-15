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
import { UpdateProductDto } from './dto/update-product.dto';
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

  async findProduct(id: number) {
    return this.productRepository.findOne({
      where: { id: id },
      relations: ['images', 'colors', 'sizes', 'categories'],
    });
  }

  async findAllFeatured() {
    return this.productRepository.find({
      where: { featured: true },
      relations: ['images', 'colors', 'sizes', 'categories'],
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
    const existingProduct = await this.productRepository.findOne({
      where: { name: addProductDto.name },
    });

    if (existingProduct) {
      throw new ConflictException(
        'name: * Ya existe un producto con ese nombre',
      );
    }

    // Retrieve all entities to map from
    const colors = await this.colorRepository.find();
    const sizes = await this.sizeRepository.find();
    const categories = await this.categoryRepository.find();

    if (colors.length === 0 || sizes.length === 0 || categories.length === 0) {
      throw new ConflictException(
        `No hay suficientes datos para crear el producto`,
      );
    }

    // Map category values to actual category entities
    const categoryEntities = addProductDto.categories.map((categoryDto) => {
      const category = categories.find(
        (cat) => cat.id === parseInt(categoryDto.value),
      );
      if (!category) {
        throw new ConflictException(
          `Category with ID "${categoryDto.value}" not found`,
        );
      }
      return category;
    });

    // Map color values to actual color entities
    const colorEntities = addProductDto.colors.map((colorName) => {
      const color = colors.find(
        (c) => c.name.toLowerCase() === colorName.toLowerCase(),
      );
      if (!color) {
        throw new ConflictException(`Color with name "${colorName}" not found`);
      }
      return color;
    });

    // Map size values to actual size entities
    const sizeEntities = addProductDto.sizes.map((sizeName) => {
      const size = sizes.find(
        (s) => s.name.toLowerCase() === sizeName.toLowerCase(),
      );
      if (!size) {
        throw new ConflictException(`Size with name "${sizeName}" not found`);
      }
      return size;
    });

    // Map image URLs to ProductImage entities
    const imageEntities = await Promise.all(
      addProductDto.images.map(async (url: string) => {
        const image = this.productImageRepository.create({ url });
        await this.productImageRepository.save(image);
        return image;
      }),
    );

    // Create and save the new product
    const newProduct = this.productRepository.create({
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
      categories: categoryEntities,
      colors: colorEntities,
      sizes: sizeEntities,
      images: imageEntities,
    });

    await this.productRepository.save(newProduct);

    return newProduct;
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new Error('File not provided');
    }

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

  async deleteProduct(id: number) {
    // Buscar el producto por su ID
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['images'], // Incluir imágenes si las necesitas eliminar
    });

    // Verificar si el producto existe
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    // Eliminar las imágenes asociadas si es necesario
    if (product.images.length > 0) {
      await this.productImageRepository.remove(product.images);
    }

    // Eliminar el producto
    return this.productRepository.remove(product);
  }

  async updateProduct(id: number, changes: UpdateProductDto) {
    // Buscar el producto por su ID
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['categories', 'colors', 'sizes', 'images'],
    });

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    // Actualizar los campos proporcionados en el DTO
    Object.assign(product, changes);

    // Actualizar las categorías, colores, tamaños e imágenes si se proporcionan
    if (changes.categories) {
      const categoryIds = changes.categories.map((categoryDto) =>
        parseInt(categoryDto.value, 10),
      );
      const categories = await this.categoryRepository.find({
        where: { id: In(categoryIds) },
      });
      product.categories = categories;
    }

    if (changes.colors) {
      const colors = await this.colorRepository.find({
        where: { name: In(changes.colors.map((color) => color.toLowerCase())) },
      });
      product.colors = colors;
    }

    if (changes.sizes) {
      const sizes = await this.sizeRepository.find({
        where: { name: In(changes.sizes.map((size) => size.toLowerCase())) },
      });
      product.sizes = sizes;
    }

    if (changes.images) {
      const imageEntities = await Promise.all(
        changes.images.map(async (url: string) => {
          const image = this.productImageRepository.create({ url });
          await this.productImageRepository.save(image);
          return image;
        }),
      );
      product.images = imageEntities;
    }

    // Guardar los cambios en la base de datos
    return this.productRepository.save(product);
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
