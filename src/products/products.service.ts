import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './products.entity';
import { InjectRepository } from '@nestjs/typeorm';

// type ProductType = { id: number; title: string; price: number };
@Injectable() /// first step
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  /**
   *  create new product
   */
  public createProduct(dto: CreateProductDto) {
    const newProduct = this.productsRepository.create(dto);
    return this.productsRepository.save(newProduct);
  }

  /**
   *get all Product
   */
  public getAllProducts() {
    return this.productsRepository.find();
  }

  /**
   * get one product by id
   */
  public async getOneBy(id: number) {
    // const product = this.productsRepository.findOneBy({ id });
    const product = await this.productsRepository.findOne({ where: { id } });
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
  public async updateProduct(id: number, dto: UpdateProductDto) {
    const product = await this.getOneBy(id);

    product.title = dto.title ?? product.title;
    product.description = dto.description ?? product.description;
    product.price = dto.price ?? product.price;

    return this.productsRepository.save(product);
  }

  /**
   *delete product
   */
  public async deleteProduct(id: number) {
    const product = await this.getOneBy(id);
    await this.productsRepository.remove(product);
    return { message: 'product deleted successfully' };
  }
}
