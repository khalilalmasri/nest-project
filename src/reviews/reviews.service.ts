import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dtos/create-review.dto';
import { Review } from './reviews.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
  ) {}
  /**
   * create new review
   * @param productId id of the product
   * @param userId id of the user
   * @param dto data for creating new review
   * @returns created review from db
   */
  public async createReview(
    productId: number,
    userId: number,
    dto: CreateReviewDto,
  ) {
    const product = await this.productsService.getOneBy(productId);
    const user = await this.usersService.getCurrentUser(userId);
    const newReview = this.reviewsRepository.create({
      ...dto,
      user,
      product,
    });
    const result = await this.reviewsRepository.save(newReview);
    return {
      id: result.id,
      comment: result.comment,
      rating: result.rating,
      createdAt: result.createdAt,
      userId: result.user.id,
      productId: result.product.id,
    };
  }
}
