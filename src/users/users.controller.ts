import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserType } from 'src/utils/enums';
// import { LoggerInterceptor } from 'src/utils/intereceptors/logger.interceptor';
import { JWTpayloadType } from 'src/utils/types';
import { LoginDto } from './Dtos/login.dto';
import { RegisterDto } from './Dtos/register.dto';
import { UpdateUserDto } from './Dtos/update-user.dto';
import { AuthGuard } from './Guards/auth.guard';
import { AuthRolesGuard } from './Guards/auth.roles.guard';
import { CurrentUser } from './decorator/current-user.decorator';
import { Roles } from './decorator/user-role.decorator';
import { UsersService } from './users.service';

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
  // @UseInterceptors(LoggerInterceptor)
  // @UseInterceptors(ClassSerializerInterceptor)  // replace in provider app.module
  public getCurrentUser(@CurrentUser() payload: JWTpayloadType) {
    console.log('get current user route');
    return this.usersService.getCurrentUser(payload.id);
  }

  //get : /api/users
  @Get()
  @Roles(UserType.ADMIN) // custom decorator to make roles just for admin delete  UserType.NORMAL_USER
  @UseGuards(AuthRolesGuard)
  // @UseInterceptors(ClassSerializerInterceptor)  // replace in provider app.module
  public getAllUsers() {
    return this.usersService.getall();
  }

  //Put : /api/users/:id
  @Put()
  @Roles(UserType.ADMIN, UserType.NORMAL_USER) // custom decorator to make roles just for admin delete  UserType.NORMAL_USER
  @UseGuards(AuthRolesGuard)
  public updateUser(
    @CurrentUser() payload: JWTpayloadType,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.update(payload.id, body);
  }

  // Delete : /api/users/:id
  @Delete(':id')
  @Roles(UserType.ADMIN, UserType.NORMAL_USER) // custom decorator to make roles just for admin delete  UserType.NORMAL_USER
  @UseGuards(AuthRolesGuard)
  public deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() payload: JWTpayloadType,
  ) {
    return this.usersService.delete(id, payload);
  }
}
