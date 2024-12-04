import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RegisterDto } from './Dtos/register.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from './Dtos/login.dto';
import { JWTpayloadType, AccesTokenType } from 'src/utils/types';
import { UpdateUserDto } from './Dtos/update-user.dto';
import { UserType } from 'src/utils/enums';
import { AuthProvider } from './auth.provider';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly authService: AuthProvider,
  ) {}

  /**
   * create new user
   * @param registerDto data for creating new user
   * @returns JWT (access token)
   */
  public async register(registerDto: RegisterDto): Promise<AccesTokenType> {
    return this.authService.register(registerDto);
  }

  /**
   * login user
   * @param loginDto data for login
   * @returns user object  --> jwt token
   * @throws BadRequestException if user not found or invalid username or password
   */
  public async login(loginDto: LoginDto): Promise<AccesTokenType> {
    return this.authService.login(loginDto);
  }

  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * get current user by id
   * @param id user id
   * @returns user object
   * @throws BadRequestException if user not found
   */
  /******  2031beeb-912c-4974-ab4f-388317645d09  *******/
  public async getCurrentUser(id: number): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    const user = this.usersRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException('user not found');
    return user;
  }
  /**
   * get all users from db
   * @returns collections of useres
   */
  public getall(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * update user
   * @param id  id logged in user
   * @param updateDto data for update the user
   * @returns updated user from the db
   */
  public async update(id: number, updateDto: UpdateUserDto) {
    const { password, username } = updateDto;
    const user = await this.usersRepository.findOne({ where: { id } });
    user.username = username ?? user.username;
    if (password) {
      user.password = await this.authService.hashPassword(password);
    }
    return this.usersRepository.save(user);
  }
  /**
   * delete user
   * @param userId  id of the user
   * @param payload JwtPayload
   * @returns  a success message
   */
  public async delete(userId: number, payload: JWTpayloadType) {
    const user = await this.getCurrentUser(userId);
    if (user.id === payload?.id || payload?.userType === UserType.ADMIN) {
      await this.usersRepository.remove(user);
      return { message: 'user deleted successfully' };
    }
    throw new ForbiddenException(
      'access denied , you can not delete this user',
    );
  }
  /**
   * generate jwt token
   * @param payload data for generating jwt token
   * @returns jwt token
   */
}
