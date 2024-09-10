import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../../src/modules/products/entities/product.entity';
import { Color } from '../../src/modules/products/entities/color.entity';
import { Size } from '../../src/modules/products/entities/size.entity';
import { Category } from '../../src/modules/products/entities/category.entity';
import { ProductImage } from '../../src/modules/products/entities/image.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductSeeder implements OnModuleInit {
  private readonly apiUrl: string;

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
    @InjectRepository(Size)
    private readonly sizeRepository: Repository<Size>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('API_URL');
  }

  async onModuleInit() {
    await this.seedProducts();
  }

  async seedProducts() {
    const count = await this.productRepository.count();
    if (count > 0) {
      console.log('Los productos ya están insertados.');
      return;
    }

    const colors = await this.colorRepository.find();
    const sizes = await this.sizeRepository.find();
    const categories = await this.categoryRepository.find();

    if (colors.length === 0 || sizes.length === 0 || categories.length === 0) {
      console.error(
        'No hay datos suficientes en los seeders de Color, Size o Category.',
      );
      return;
    }

    const products = [
      {
        name: 'Vestido de verano',
        slug: this.slugify('Vestido de verano'),
        description: 'Un hermoso vestido de verano.',
        stock: 50,
        price: 29.99,
        discount: 5,
        colors: [colors[0], colors[1]],
        sizes: [sizes[0], sizes[1]],
        categories: [categories[0], categories[1]],
        images: [
          `${this.apiUrl}/files/vestido-de-verano-1.jpg`,
          `${this.apiUrl}/files/vestido-de-verano-2.jpg`,
        ],
      },
      {
        name: 'Camisa de cuadros',
        slug: this.slugify('Camisa de cuadros'),
        description: 'Camisa de cuadros elegante.',
        stock: 100,
        price: 19.99,
        discount: 10,
        colors: [colors[2], colors[3]],
        sizes: [sizes[2], sizes[3]],
        categories: [categories[2], categories[3]],
        images: [
          `${this.apiUrl}/files/camisa-de-cuadros-1.jpg`,
          `${this.apiUrl}/files/camisa-de-cuadros-2.jpg`,
        ],
      },
      {
        name: 'Chaqueta de cuero',
        slug: this.slugify('Chaqueta de cuero'),
        description: 'Chaqueta de cuero de alta calidad.',
        stock: 30,
        price: 99.99,
        discount: 15,
        colors: [colors[4]],
        sizes: [sizes[0]],
        categories: [categories[4]],
        images: [`${this.apiUrl}/files/chaqueta-de-cuero-1.jpg`],
        featured: true,
      },
      {
        name: 'Abrigo de lana',
        slug: this.slugify('Abrigo de lana'),
        description: 'Abrigo de lana cálido y cómodo.',
        stock: 20,
        price: 129.99,
        discount: 20,
        colors: [colors[5]],
        sizes: [sizes[1]],
        categories: [categories[5]],
        images: [
          `${this.apiUrl}/files/abrigo-de-lana-1.jpg`,
          `${this.apiUrl}/files/abrigo-de-lana-2.jpg`,
        ],
        featured: true,
      },
      {
        name: 'Pantalones deportivos',
        slug: this.slugify('Pantalones deportivos'),
        description: 'Pantalones deportivos para entrenamiento.',
        stock: 60,
        price: 39.99,
        discount: 10,
        colors: [colors[6]],
        sizes: [sizes[2]],
        categories: [categories[6]],
        images: [
          `${this.apiUrl}/files/vestido-de-verano-2.jpg`,
          `${this.apiUrl}/files/vestido-de-verano-2.jpg`,
        ],
        featured: true,
      },
      {
        name: 'Jersey de lana',
        slug: this.slugify('Jersey de lana'),
        description: 'Jersey de lana suave y cálido.',
        stock: 40,
        price: 49.99,
        discount: 5,
        colors: [colors[7]],
        sizes: [sizes[3]],
        categories: [categories[7]],
        images: [
          `${this.apiUrl}/files/jersey-de-lana-1.jpg`,
          `${this.apiUrl}/files/jersey-de-lana-2.jpg`,
        ],
        featured: true,
      },
    ];

    for (const productData of products) {
      const product = this.productRepository.create({
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        stock: productData.stock,
        price: productData.price,
        discount: productData.discount,
        colors: productData.colors,
        sizes: productData.sizes,
        categories: productData.categories,
        featured: productData.featured || false,
      });

      await this.productRepository.save(product);

      // Crear imágenes relacionadas para el producto
      for (const imageUrl of productData.images) {
        const image = this.productImageRepository.create({
          url: imageUrl,
          product: product,
        });
        await this.productImageRepository.save(image);
      }
    }

    console.log('Productos insertados con imágenes');
  }

  slugify(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '');
  }
}
