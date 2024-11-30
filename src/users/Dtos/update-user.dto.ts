import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  @IsOptional()
  password?: string;

  @Length(2, 150)
  @IsString()
  @IsOptional()
  username?: string;
}
