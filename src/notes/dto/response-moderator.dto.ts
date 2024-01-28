// import {
//   IsString,
//   IsOptional,
//   IsEnum,
//   IsEmail,
//   IsDate,
//   IsNumber,
//   IsArray,
//   ValidateNested,
// } from 'class-validator';

// import { ApiProperty } from '@nestjs/swagger';
// import { Type } from 'class-transformer';

// TODO
// export class ResponseUsersDto {
//   @ApiProperty({
//     description: 'массив пользователей',
//     isArray: true,
//     type: ResponseUserDto,
//   })
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => ResponseUserDto)
//   users: ResponseUserDto[];

//   @ApiProperty({
//     description: 'колличество получаемых пользователей',
//     type: Number,
//     example: 1,
//   })
//   @IsNumber()
//   limit: number;

//   @ApiProperty({
//     description: 'текущая страница',
//     type: Number,
//     example: 1,
//   })
//   @IsNumber()
//   currentPage: number;

//   @ApiProperty({
//     description: 'Всего страниц',
//     type: Number,
//     example: 10,
//   })
//   @IsNumber()
//   totalPage: number;

//   @ApiProperty({
//     description: 'Всего пользователей',
//     type: Number,
//     example: 1001,
//   })
//   @IsNumber()
//   totalCountUser: number;
// }
