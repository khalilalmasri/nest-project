import { Controller, Get } from '@nestjs/common';

@Controller()
export class UsersController {
  @Get('/api/users')
  public getAllProducts() {
    return [
      { id: 1, user: 'khalil1@1992.com' },
      { id: 2, user: 'khalil2@1992.com' },
      { id: 3, user: 'khalil3@1992.com' },
    ];
  }
}
