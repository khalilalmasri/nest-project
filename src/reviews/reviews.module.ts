import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';
import { ReviewsController } from './reviews.controller';
import { Review } from './reviews.entity';
import { ReviewsService } from './reviews.service';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  imports: [
    TypeOrmModule.forFeature([Review]),
    ProductsModule,
    UsersModule,
    JwtModule,
  ],
})
export class ReviewsModule {}
