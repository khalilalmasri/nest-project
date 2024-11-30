import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  Max,
  MinLength,
  MaxLength,
  Length,
} from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'title must be string' })
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  @Length(3, 20)
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  price: number;
}
