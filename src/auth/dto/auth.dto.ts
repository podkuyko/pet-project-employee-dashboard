import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsDate,
  IsStrongPassword,
  IsNumber,
} from 'class-validator';

import { UserGender } from 'src/users/users.entity';

export class LoginDto {
  @ApiProperty({
    description: 'сложный пароль',
    minimum: 6,
    example: 'StrongPassw0rd!',
    required: true,
  })
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    description: 'email в валидном формате',
    example: 'example@email.com',
    required: true,
  })
  @IsEmail()
  email: string;
}

export class RegistrationDto extends LoginDto {
  @ApiProperty({
    description: 'имя пользователя',
    example: 'Дмитрий',
    type: String,
    required: true,
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'фамилия пользователя',
    example: 'Подкуйко',
    required: true,
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'отчество пользователя',
    example: 'Олегович',
    required: false,
  })
  @IsString()
  @IsOptional()
  patronymic: string;

  @ApiProperty({
    description: 'пол пользователя',
    enum: UserGender,
    example: UserGender.FEMALE,
    required: true,
  })
  @IsEnum(UserGender)
  gender: UserGender;

  @ApiProperty({
    description: 'пока не работает ;)',
    example: 'пока не рабоатет ;)',
    required: false,
  })
  @IsString() //тут фото
  @IsOptional()
  avatar: string;

  @ApiProperty({
    description: 'Дата рождения пользователя',
    example: null,
    type: Date,
  })
  @IsDate()
  @IsOptional()
  birthday: Date;
}

export class ResponseAccessToken {
  @ApiProperty({
    description: 'access token',
    example:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4QVNEU0FwbGVAZW1haWwuY29tIiwiaWQiOjUsInJvbGUiOiJnaG9zdCIsImlhdCI6MTY5ODI2MDI4OSwiZXhwIjoxNjk5MTI0Mjg5fQ.36fxEuDlMwM6fV2UNU32qnsO4KfuSJ5VzjF7xQYVB7U',
    required: true,
  })
  @IsString()
  access_token: string;
}

export class ResponseRegistrationDto extends RegistrationDto {
  @ApiProperty({
    description: 'id пользователя',
    example: '10',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'номер телефона пользователя',
    example: '8 800 555 35 35',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone: number;

  @ApiProperty({
    description: 'дата регистрации пользователя',
    example: new Date(),
  })
  @IsDate()
  created: Date;

  @ApiProperty({
    description: 'дата последнего изменения данных пользователя',
    example: new Date(),
  })
  @IsDate()
  updated: Date;

  @ApiProperty({
    description: 'access token',
    example:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4QVNEU0FwbGVAZW1haWwuY29tIiwiaWQiOjUsInJvbGUiOiJnaG9zdCIsImlhdCI6MTY5ODI2MDI4OSwiZXhwIjoxNjk5MTI0Mjg5fQ.36fxEuDlMwM6fV2UNU32qnsO4KfuSJ5VzjF7xQYVB7U',
    required: true,
  })
  @IsString()
  access_token: string;
}
