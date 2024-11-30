import { Injectable } from '@nestjs/common';

@Injectable()
export class ReviewsService {
  constructor() {}
  public getAllProducts() {
    return [
      { id: 1, comment: 'good', rating: 3 },
      { id: 2, comment: 'very good', rating: 5 },
      { id: 3, comment: 'bad', rating: 2 },
    ];
  }
}
