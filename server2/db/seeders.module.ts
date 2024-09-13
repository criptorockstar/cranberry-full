import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategorySeeder } from './seeds/category.seeder';
import { ColorSeeder } from './seeds/color.seeder';
import { SizeSeeder } from './seeds/size.seeder';
import { ProductEntity } from '../src/modules/products/entities/product.entity';
import { Category } from '../src/modules/products/entities/category.entity';
import { Color } from '../src/modules/products/entities/color.entity';
import { Size } from '../src/modules/products/entities/size.entity';
import { ProductImage } from 'src/modules/products/entities/image.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { UserSeeder } from './seeds/user.seeder';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      Color,
      Size,
      Category,
      ProductImage,
      UserEntity,
    ]),
  ],
  providers: [CategorySeeder, ColorSeeder, SizeSeeder, UserSeeder],
})
export class SeedersModule implements OnModuleInit {
  constructor(
    private readonly categorySeeder: CategorySeeder,
    private readonly colorSeeder: ColorSeeder,
    private readonly sizeSeeder: SizeSeeder,
    private readonly userSeeder: UserSeeder,
  ) {}

  async onModuleInit() {
    await this.categorySeeder.seedCategories();
    await this.colorSeeder.seedColors();
    await this.sizeSeeder.seedSizes();
    await this.userSeeder.seedUser();
  }
}
