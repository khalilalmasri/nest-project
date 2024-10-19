import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/products.entity';
@Module({
  imports: [
    UsersModule,
    ProductsModule,
    ReviewsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456789',
      database: 'nest-test-db',
      autoLoadEntities: true,
      synchronize: true, // only for development mode
      entities: [Product],
    }),
  ],
})
export class AppModule {}
