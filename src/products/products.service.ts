import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Product } from './products.entity';

// type ProductType = { id: number; title: string; price: number };
@Injectable() // first step
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly usersService: UsersService,
  ) {}

  /**
   *  create new product
   * @param dto data for creating new product
   * @param userId id of logged in user
   * @returns created product
   */
  public async createProduct(dto: CreateProductDto, userId: number) {
    const user = await this.usersService.getCurrentUser(userId);
    const newProduct = this.productsRepository.create({
      ...dto,
      title: dto.title.toLowerCase(), // Book =>book
      user,
    });
    return this.productsRepository.save(newProduct);
  }

  /**
   *get all Product
   * @returns collections of products
   */
  public getAllProducts() {
    return this.productsRepository.find({
      relations: { user: true, reviews: true }, //we can use eager: true or relations
    });
    // return this.productsRepository.find({ relations: ['user', 'reviews'] });
  }

  /**
   * get one product by id
   * @param id product id
   * @returns product from db
   */
  public async getOneBy(id: number) {
    // const product = this.productsRepository.findOneBy({ id });
    const product = await this.productsRepository.findOne({
      where: { id },
      // relations: { user: true, reviews: true }, // replace in products.entity with eager: true
    });
    if (!product) {
      throw new NotFoundException("product doesn't exist", {
        description: 'Product not found', // optional
      });
    }
    return product;
  }

  /**
   * update product
   * @param id product id
   * @param dto data for update the product
   * @returns updated product
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
   * @param id product id
   * @returns a success message
   */
  public async deleteProduct(id: number) {
    const product = await this.getOneBy(id);
    await this.productsRepository.remove(product);
    return { message: 'product deleted successfully' };
  }
}
