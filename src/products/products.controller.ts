import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete, // BadRequestException,UnauthorizedException,ForbiddenException,
  ParseIntPipe, // if  string was number => number    if  string was not number  =>error
} from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductsService } from './products.service';

@Controller('api/products')
export class ProductsController {
  private productsService: ProductsService = new ProductsService();

  // Post: POST /api/products
  @Post()
  public createProduct(@Body() body: CreateProductDto) {
    return this.productsService.createProduct(body);
  }

  // Get: GET /api/products
  @Get()
  public getAllProducts() {
    return this.productsService.getAllProducts();
  }

  // Get: GET /api/products/:id
  @Get('/:id')
  public getSingleProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getSingleProduct(id);
  }

  // Put: PUT /api/products/:id
  @Put('/:id')
  public updateProduct(
    @Param('id', ParseIntPipe) id: string,
    @Body()
    body: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(id, body);
  }

  @Delete('/:id')
  public deleteProduct(@Param('id', ParseIntPipe) id: string) {
    return this.productsService.deleteProduct(id);
  }
}
