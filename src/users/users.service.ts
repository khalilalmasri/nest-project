import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './Dtos/register.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * create new user
   * @param registerDto data for creating new user
   * @returns JWT (access token)
   */
  public async register(registerDto: RegisterDto) {
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
    // todo -> generate jwt token
    return newUser;
  }
}
