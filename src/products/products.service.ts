import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { UsersService } from 'src/users/users.service';

type ProductType = { id: number; title: string; price: number };
@Injectable() /// first step
export class ProductsService {
  constructor(private readonly usersService: UsersService) {}
  private products: ProductType[] = [
    { id: 1, title: 'book', price: 10 },
    { id: 2, title: 'pen', price: 5 },
    { id: 3, title: 'laptop', price: 2 },
  ];

  /**
   *  create new product
   */
  public createProduct({ title, price }: CreateProductDto) {
    const newProduct: ProductType = {
      id: this.products.length + 1,
      title,
      price,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  /**
   *get all Product
   */
  public getAllProducts() {
    const products = this.products;
    const users = this.usersService.getAllProducts();
    return { products, users };
  }

  /**
   * get one product by id
   */
  public getSingleProduct(id: number) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException("product doesn't exist", {
        description: 'Product not found', // optional
      });
    }
    return product;
  }

  /**
   * update product
   */
  public updateProduct(id: string, updateProductDto: UpdateProductDto) {
    const product = this.products.find((p) => p.id === +id);
    if (!product) {
      throw new NotFoundException("product doesn't exist", {
        description: 'Product not found', // optional
      });
    }
    console.log(updateProductDto);
    return { message: 'update success' + id };
  }

  /**
   *delete product
   */
  public deleteProduct(id: string) {
    const product = this.products.find((p) => p.id === +id);
    if (!product) {
      throw new NotFoundException("product doesn't exist", {
        description: 'Product not found', // optional
      });
    }
    return { message: 'delete success' + id };
  }
}
