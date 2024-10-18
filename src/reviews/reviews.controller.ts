import { Controller, Get } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { UsersService } from 'src/users/users.service';

@Controller()
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly usersService: UsersService,
  ) {}

  // @Get('/api/reviews')
  @Get('/api/reviews')
  public getAllProducts() {
    const reviews = this.reviewsService.getAllProducts();
    const users = this.usersService.getAllProducts();
    return { reviews, users };
  }
}
