import {
  Body,
  Controller,
  Delete,
  Get,
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
import { CreateReviewDto, UpdateReviewDto } from './dtos/create-review.dto';
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
  // get: /api/reviews
  @Get()
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  public getAllReviews() {
    return this.reviewsService.getAllReviews();
  }
  // @Post('/api/reviews/:id')
  @Post(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  public updateReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateReviewDto,
    @CurrentUser() payload: JWTpayloadType,
  ) {
    return this.reviewsService.updateReview(id, payload.id, body);
  }
  // @Delete('/api/reviews/:id')
  @Delete(':id')
  @UseGuards(AuthRolesGuard)
  @Roles(UserType.ADMIN, UserType.NORMAL_USER)
  public deleteReview(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() payload: JWTpayloadType,
  ) {
    return this.reviewsService.deleteReview(id, payload);
  }
}
