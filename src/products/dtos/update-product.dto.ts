import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  @IsOptional()
  price?: number;
}
