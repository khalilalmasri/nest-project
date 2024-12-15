import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthRolesGuard } from 'src/users/Guards/auth.roles.guard';
import { CurrentUser } from 'src/users/decorator/current-user.decorator';
import { Roles } from 'src/users/decorator/user-role.decorator';
import { UserType } from 'src/utils/enums';
import { JWTpayloadType } from 'src/utils/types';
import { CreateReviewDto } from './dtos/create-review.dto';
import { ReviewsService } from './reviews.service';

@Controller('api/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // @Post('/api/reviews/:productId')
  @Post(':productId')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  public createNewReview(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() body: CreateReviewDto,
    @CurrentUser() payload: JWTpayloadType,
  ) {
    return this.reviewsService.createReview(productId, payload.id, body);
  }
}
