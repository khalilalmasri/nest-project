import { Controller, Get } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // @Get('/api/reviews')
  @Get('/api/reviews')
  public getAllProducts() {
    return this.reviewsService.getAllProducts();
  }
}
