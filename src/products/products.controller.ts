import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  Put,
  Delete, // BadRequestException,UnauthorizedException,ForbiddenException,
} from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
type ProductType = { id: number; title: string; price: number };

@Controller('api/products')
export class ProductsController {
  private products: ProductType[] = [
    { id: 1, title: 'book', price: 10 },
    { id: 2, title: 'pen', price: 5 },
    { id: 3, title: 'laptop', price: 2 },
  ];

  // Post: POST /api/products
  @Post()
  public createProduct(@Body() body: CreateProductDto) {
    const newProduct: ProductType = {
      id: this.products.length + 1,
      title: body.title,
      price: body.price,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  // Get: GET /api/products
  @Get()
  public getAllProducts() {
    return this.products;
  }

  // Get: GET /api/products/:id
  @Get('/:id')
  public getSingleProduct(@Param('id') id: string) {
    const product = this.products.find((p) => p.id === +id);
    if (!product) {
      throw new NotFoundException("product doesn't exist", {
        description: 'Product not found', // optional
      });
    }
    return product;
  }

  // Put: PUT /api/products/:id
  @Put('/:id')
  public updateProduct(
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
  ) {
    const product = this.products.find((p) => p.id === +id);
    if (!product) {
      throw new NotFoundException("product doesn't exist", {
        description: 'Product not found', // optional
      });
    }
    console.log(body);
    return { message: 'update success' + id };
  }

  @Delete('/:id')
  public deleteProduct(@Param('id') id: string) {
    const product = this.products.find((p) => p.id === +id);
    if (!product) {
      throw new NotFoundException("product doesn't exist", {
        description: 'Product not found', // optional
      });
    }
    return { message: 'delete success' + id };
  }
}
