import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Headers,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthenticationGuard } from 'src/common/guards/authentication.guard';
import { AuthorizeGuard } from 'src/common/guards/authorization.guard';
import { Roles } from 'src/common/enums';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AddProductDto } from './dto/add-product.dto';
import { AddCategoryDto } from './dto/add-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import multerOptions from 'src/common/multer.config';

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

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Post('/create-product')
  async addProduct(
    @Body() addProductDto: AddProductDto,
    @CurrentUser() user: any,
  ) {
    return this.productsService.addProduct(addProductDto);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Post('/categories/create-category')
  async addCategory(
    @Body() addCategoryDto: AddCategoryDto,
    @CurrentUser() user: any,
  ) {
    return this.productsService.addCategory(addCategoryDto);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Delete('/categories/delete-category/:id')
  async deleteCategory(@Param('id') id: number) {
    return this.productsService.deleteCategory(id);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Put('/categories/category/:id')
  async updateCategory(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.productsService.updateCategory(id, updateCategoryDto);
  }

  @Get('/categories/category/:id')
  getCategory(@Param('id') id: number) {
    return this.productsService.findCategory(id);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    try {
      const imageUrl = await this.productsService.uploadImage(file);
      return { imageUrl };
    } catch (error: any) {
      return { error: error.message };
    }
  }
}
