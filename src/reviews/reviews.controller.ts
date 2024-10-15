import { Controller, Get } from '@nestjs/common';

@Controller()
export class ReviewsController {
  @Get('/api/reviews')
  public getAllProducts() {
    return [
      { id: 1, comment: 'book', rating: 3 },
      { id: 2, comment: 'pen', rating: 5 },
      { id: 3, comment: 'laptop', rating: 2 },
    ];
  }
}
