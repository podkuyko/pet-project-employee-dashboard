import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsDate,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { UserGender, UserRole } from '../users.entity';

export class ResponseUserDto {
  @ApiProperty({
    description: 'id пользователя',
    type: Number,
    example: '1',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'имя пользователя',
    type: String,
    example: 'Dmitry',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'фамилия пользователя',
    type: String,
    example: 'Enotov',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'отчество пользователя',
    type: String,
    example: 'Максимович',
    required: false,
  })
  @IsOptional()
  @IsString()
  patronymic: string;

  @ApiProperty({
    description: 'пол пользователя',
    enum: UserGender,
    example: UserGender.MALE,
  })
  @IsEnum(UserGender)
  gender: string;

  @ApiProperty({
    description: 'email пользователя',
    type: String,
    example: 'example@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'ссылка на аватарку пользователя',
    type: String,
    example: 'https://example.com/avatar.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar: string;

  @ApiProperty({
    description: 'ссылка на аватарку пользователя',
    type: Date,
    example: new Date(),
    required: false,
  })
  @IsOptional()
  @IsDate()
  birthday: Date;

  @ApiProperty({
    description: 'ссылка на аватарку пользователя',
    enum: UserRole,
    example: UserRole.GUEST,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    description: 'телефон пользователя',
    type: Number,
    example: null,
    required: false,
  })
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'телефон пользователя',
    type: Date,
    example: new Date(),
    required: true,
  })
  @IsDate()
  created: string;

  @ApiProperty({
    description: 'телефон пользователя',
    type: Date,
    example: new Date(),
    required: true,
  })
  @IsDate()
  updated: string;
}

export class ResponseUsersDto {
  @ApiProperty({
    description: 'массив пользователей',
    isArray: true,
    type: ResponseUserDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResponseUserDto)
  users: ResponseUserDto[];

  @ApiProperty({
    description: 'колличество получаемых пользователей',
    type: Number,
    example: 1,
  })
  @IsNumber()
  limit: number;

  @ApiProperty({
    description: 'текущая страница',
    type: Number,
    example: 1,
  })
  @IsNumber()
  currentPage: number;

  @ApiProperty({
    description: 'Всего страниц',
    type: Number,
    example: 10,
  })
  @IsNumber()
  totalPage: number;

  @ApiProperty({
    description: 'Всего пользователей',
    type: Number,
    example: 1001,
  })
  @IsNumber()
  totalCountUser: number;
}
