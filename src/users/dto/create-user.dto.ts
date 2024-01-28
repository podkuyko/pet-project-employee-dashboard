import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsDate,
  IsStrongPassword,
} from 'class-validator';

import { UserGender } from '../users.entity';

export class LoginDto {
  @IsStrongPassword()
  password: string;

  @IsEmail()
  email: string;
}

export class CreateUserDto extends LoginDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsOptional()
  patronymic: string;

  @IsEnum(UserGender)
  gender: UserGender;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsDate()
  @IsOptional()
  birthday: Date;
}


