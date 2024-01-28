import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcryptjs';
import { pick } from 'lodash';

import { CreateUserDto } from './dto/create-user.dto';
import { Users, UserRole } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async getAllUsers(page: number, limit: number): Promise<any> {
    const MAX_LIMIT_USERS = 100;
    const take = limit && limit < 500 ? limit : MAX_LIMIT_USERS;
    const skip = page ? (page - 1) * limit : 0;

    const [users, totalCountUser] = await this.userRepository.findAndCount({
      take,
      skip,
    });

    users.forEach((el) => {
      delete el.password;
    });

    return {
      users,
      limit,
      currentPage: page,
      totalPage: Math.ceil(totalCountUser / limit),
      totalCountUser,
    };
  }

  async getUserById(userId: number): Promise<Users> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException();

    return user;
  }

  async removeUser(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    const removeUser = await this.userRepository.remove(user);
    if (removeUser) return 'Ok';
  }

  async findUserByEmail(email: string): Promise<Users | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async createUser(user: CreateUserDto): Promise<Users> | never {
    const candidate = await this.findUserByEmail(user.email);
    if (candidate) throw new BadRequestException('user already exists!');

    const pickUserData = pick(user, [
      'firstName',
      'password',
      'lastName',
      'patronymic',
      'gender',
      'email',
      'avatar',
      'birthday',
    ]);

    const hashPassword = await hash(pickUserData.password, 10);

    const savedUser = await this.userRepository.save({
      ...pickUserData,
      password: hashPassword,
      role: UserRole.GUEST,
    });

    return await this.getUserById(savedUser.id);
  }

  async validateUser(email: string, password: string): Promise<Users> | never {
    const user = await this.findUserByEmail(email);
    if (!user) throw new UnauthorizedException();

    const isCorrectPassword = await compare(password, user.password);
    if (!isCorrectPassword) throw new UnauthorizedException('wrong password!');
    return user;
  }
}
