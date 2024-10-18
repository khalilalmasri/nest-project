import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ReviewsService } from 'src/reviews/reviews.service';

@Injectable()
export class UsersService {
  constructor(
    // this way we can inject ReviewsService in UsersService in service file
    @Inject(forwardRef(() => ReviewsService))
    private readonly reviewsService: ReviewsService,
  ) {}
  public getAllProducts() {
    return [
      { id: 1, user: 'khalil1@1992.com' },
      { id: 2, user: 'khalil2@1992.com' },
      { id: 3, user: 'khalil3@1992.com' },
    ];
  }
}
