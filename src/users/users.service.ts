import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './Dtos/register.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './Dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JWTpayloadType, AccesTokenType } from 'src/utils/types';

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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
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

  /**
   * generate jwt token
   * @param payload data for generating jwt token
   * @returns jwt token
   */
  private generateJwtToken(payload: JWTpayloadType): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
