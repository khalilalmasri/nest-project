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
import { ConfigService } from '@nestjs/config';

@Controller('api/products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly config: ConfigService, // example of config
  ) {}

  // Post: POST /api/products
  @Post()
  public createProduct(@Body() body: CreateProductDto) {
    return this.productsService.createProduct(body);
  }

  // Get: GET /api/products
  @Get()
  public getAllProducts() {
    //example of config
    const sample = this.config.get<string>('SAMPLE'); // best practice in controller
    // or
    const sample1 = process.env.SAMPLE; // not best practice in controller
    console.log({ sample, sample1 });
    return this.productsService.getAllProducts();
  }

  // Get: GET /api/products/:id
  @Get('/:id')
  public getSingleProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getOneBy(id);
  }

  // Put: PUT /api/products/:id
  @Put('/:id')
  public updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(id, body);
  }

  @Delete('/:id')
  public deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteProduct(id);
  }
}
