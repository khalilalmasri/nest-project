import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/products.entity';
import { ProductsModule } from './products/products.module';
import { Review } from './reviews/reviews.entity';
import { ReviewsModule } from './reviews/reviews.module';
import { UploadsModule } from './uploads/uploads.moduls';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
@Module({
  imports: [
    UsersModule,
    ProductsModule,
    UploadsModule,
    ReviewsModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: 'localhost',
          port: config.get<number>('DB_PORT'),
          username: config.get<string>('DB_USERNAME'),
          password: config.get('DB_PASSWORD'),
          database: config.get<string>('DB_DATABASE'),
          autoLoadEntities: true,
          synchronize: process.env.NODE_ENV !== 'development', // only for development mode
          entities: [Product, User, Review],
        };
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      // envFilePath: `.env.development`,
    }),
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor }, //to make sure we don't return password in all project
  ],
})
export class AppModule {}
