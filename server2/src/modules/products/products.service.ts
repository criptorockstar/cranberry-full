import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Color } from './entities/color.entity';
import { Size } from './entities/size.entity';
import { AddProductDto } from './dto/add-product.dto';

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

  async addProduct(addProductDto: AddProductDto) {
    // Create a new product entity
    const newProduct = this.productRepository.create({
      name: addProductDto.name,
      slug: addProductDto.name.toLowerCase().replace(/ /g, '-'),
      description: addProductDto.description,
      stock: addProductDto.stock,
      price: addProductDto.price,
      discount: addProductDto.discount,
    });

    // Find or create relations
    const category = await this.categoryRepository.findOne({
      where: { id: addProductDto.category },
    });

    const colors = await this.colorRepository.findByIds(addProductDto.colors);

    const sizes = await this.sizeRepository.findByIds(addProductDto.sizes);

    newProduct.categories = [category];
    newProduct.colors = colors;
    newProduct.sizes = sizes;

    // Guardar el nuevo producto en la base de datos
    await this.productRepository.save(newProduct);

    return newProduct;
  }

  async findCategory(id: number) {
    return this.productRepository.findOne({
      where: { id: id },
      relations: ['images'],
    });
  }
}
