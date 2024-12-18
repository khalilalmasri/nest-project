import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import { UserType } from 'src/utils/enums';
import { JWTpayloadType } from 'src/utils/types';
import { Repository } from 'typeorm';
import { CreateReviewDto, UpdateReviewDto } from './dtos/create-review.dto';
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
  /**
   * get all reviews
   * @returns all reviews
   */
  public async getAllReviews() {
    return this.reviewsRepository.find({ order: { createdAt: 'DESC' } });
  }
  /**
   * update review
   * @param id review id
   * @param dto data for update the review
   * @returns updated review from db
   */
  public async updateReview(
    reviewId: number,
    userId: number,
    dto: UpdateReviewDto,
  ) {
    const review = await this.getReviewby(reviewId);
    if (review.user.id !== userId) {
      throw new ForbiddenException(
        'access denied you can not update this review',
      );
    }
    review.rating = dto.rating ?? review.rating;
    review.comment = dto.comment ?? review.comment;
    return this.reviewsRepository.save({ ...review, ...dto });
  }
  /**
   * delete review
   * @param reviewId review id
   * @param payload JwtPayload
   * @returns a success message
   */
  public async deleteReview(reviewId: number, payload: JWTpayloadType) {
    const review = await this.getReviewby(reviewId);
    if (
      review.user.id === payload?.id ||
      payload?.userType === UserType.ADMIN
    ) {
      await this.reviewsRepository.remove(review);
      return { message: 'review deleted successfully' };
    }
    throw new ForbiddenException(
      'access denied you can not delete this review',
    );
  }
  /**
   * get review
   * @param id review id
   * @returns review from db
   */
  private async getReviewby(id: number) {
    const review = await this.reviewsRepository.findOne({
      where: { id },
    });
    if (!review) {
      throw new NotFoundException('review not found');
    }
    return review;
  }
}
