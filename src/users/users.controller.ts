import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './Dtos/register.dto';
import { LoginDto } from './Dtos/login.dto';
import { AuthGuard } from './Guards/auth.guard';
import { CurrentUser } from './decorator/current-user.decorator';
import { JWTpayloadType } from 'src/utils/types';
import { Roles } from './decorator/user-role.decorator';
import { UserType } from 'src/utils/enums';
import { AuthRolesGuard } from './Guards/auth.roles.guard';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('auth/register')
  public register(@Body() body: RegisterDto) {
    return this.usersService.register(body);
  }

  @Post('auth/login')
  @HttpCode(HttpStatus.OK) // to set status code == 200 by default is 201
  public login(@Body() body: LoginDto) {
    return this.usersService.login(body);
  }

  //get : /api/users/current-user
  @Get('current-user')
  @UseGuards(AuthGuard)
  public getCurrentUser(@CurrentUser() payload: JWTpayloadType) {
    return this.usersService.getCurrentUser(payload.id);
  }

  //get : /api/users
  @Get()
  @Roles(UserType.ADMIN) // custom decorator to make roles just for admin delete  UserType.NORMAL_USER
  @UseGuards(AuthRolesGuard)
  public getAllUsers() {
    return this.usersService.getall();
  }
}
