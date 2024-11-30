import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RegisterDto } from './Dtos/register.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './Dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JWTpayloadType, AccesTokenType } from 'src/utils/types';
import { UpdateUserDto } from './Dtos/update-user.dto';
import { UserType } from 'src/utils/enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * create new user
   * @param registerDto data for creating new user
   * @returns JWT (access token)
   */
  public async register(registerDto: RegisterDto): Promise<AccesTokenType> {
    const { email, password, username } = registerDto;
    const userFromDB = await this.usersRepository.findOne({
      where: { email },
    });
    if (userFromDB) throw new BadRequestException('user already exist');

    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);
    const hashedPassword = await this.hashPassword(password);
    let newUser = this.usersRepository.create({
      email,
      password: hashedPassword,
      username,
    });
    newUser = await this.usersRepository.save(newUser);

    const payload: JWTpayloadType = {
      id: newUser.id,
      userType: newUser.usertype,
    };
    const accessToken = await this.generateJwtToken(payload);

    return { accessToken };
  }

  /**
   * login user
   * @param loginDto data for login
   * @returns user object  --> jwt token
   * @throws BadRequestException if user not found or invalid username or password
   */
  public async login(loginDto: LoginDto): Promise<AccesTokenType> {
    const { email, password } = loginDto;
    const userFromDB = await this.usersRepository.findOne({
      where: { email },
    });
    if (!userFromDB)
      throw new BadRequestException(
        'user not found || invalid username or password',
      );
    const isPasswordMatch = await bcrypt.compare(password, userFromDB.password);
    if (!isPasswordMatch)
      throw new BadRequestException(
        'wrong password || invalid username or password',
      );

    const accessToken = await this.generateJwtToken({
      id: userFromDB.id,
      userType: userFromDB.usertype,
    });

    return { accessToken };
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
      user.password = await this.hashPassword(password);
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
  private generateJwtToken(payload: JWTpayloadType): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  /**
   * hash password
   * @param password password to hash
   * @returns hashed password
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
