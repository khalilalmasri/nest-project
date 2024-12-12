import {
  Body,
  Controller,
  Delete,
  Get,
  Param, // BadRequestException,UnauthorizedException,ForbiddenException,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards, // if  string was number => number    if  string was not number  =>error
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthRolesGuard } from 'src/users/Guards/auth.roles.guard';
import { CurrentUser } from 'src/users/decorator/current-user.decorator';
import { Roles } from 'src/users/decorator/user-role.decorator';
import { UserType } from 'src/utils/enums';
import { JWTpayloadType } from 'src/utils/types';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductsService } from './products.service';

@Controller('api/products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly config: ConfigService, // example of config
  ) {}

  // Post: POST /api/products
  @Post()
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  public createProduct(
    @Body() body: CreateProductDto,
    @CurrentUser() payload: JWTpayloadType,
  ) {
    return this.productsService.createProduct(body, payload.id);
  }

  // Get: GET /api/products
  @Get()
  public getAllProducts(
    @Query('title') title: string,
    @Query('minPrice') minPrice: string,
    @Query('maxPrice') maxPrice: string,
  ) {
    //example of config
    const sample = this.config.get<string>('SAMPLE'); // best practice in controller
    // or
    const sample1 = process.env.SAMPLE; // not best practice in controller
    console.log({ sample, sample1 });
    return this.productsService.getAllProducts(title, minPrice, maxPrice);
  }

  // Get: GET /api/products/:id
  @Get('/:id')
  public getSingleProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getOneBy(id);
  }

  // Put: PUT /api/products/:id
  @Put('/:id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  public updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(id, body);
  }

  @Delete('/:id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN)
  public deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteProduct(id);
  }
}
