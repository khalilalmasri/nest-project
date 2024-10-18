import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ReviewsService {
  constructor(
    // this way we can inject UsersService in ReviewsService in service file
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}
  public getAllProducts() {
    return [
      { id: 1, comment: 'good', rating: 3 },
      { id: 2, comment: 'very good', rating: 5 },
      { id: 3, comment: 'bad', rating: 2 },
    ];
  }
}
