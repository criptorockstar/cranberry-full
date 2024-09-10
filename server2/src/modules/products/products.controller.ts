import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AddProductDto } from './dto/add-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProducts() {
    return this.productsService.findAll();
  }

  @Get('/featured')
  findAllFeatured() {
    return this.productsService.findAllFeatured();
  }

  @Get('/product/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findProduct(slug);
  }

  @Get('/categories/')
  getAllCategories() {
    return this.productsService.findAllCategories();
  }

  @Get('/colors')
  getAllColors() {
    return this.productsService.findAllColors();
  }

  @Get('sizes')
  getAllSizes() {
    return this.productsService.findAllSizes();
  }

  @UseGuards(AuthenticationGuard)
  @Post('/add-product')
  async addProduct(
    @Body() addProductDto: AddProductDto,
    @CurrentUser() user: any,
  ) {
    return this.productsService.addProduct(addProductDto);
  }
}
