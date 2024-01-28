import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsDate,
  IsObject,
  IsArray,
  ValidateNested,
} from 'class-validator';

export class CreateDashboardDto {
  @ApiProperty({
    description: 'заголовок доски',
    example: 'отдел номер 1',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'описание доски',
    example: 'доска для сотрудников отдела #1',
  })
  @IsString()
  description: string;
}

class OwnerDashboardDto {
  @IsString()
  id: string;
}

export class ResponseCreateDashboardDto {
  @ApiProperty({
    description: 'заголовок доски',
    example: 'отдел номер 1',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'описание доски',
    example: 'доска для сотрудников отдела #1',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'владелец доски',
    type: OwnerDashboardDto,
    example: { id: 1 },
  })
  @IsObject()
  owner: OwnerDashboardDto | number;

  @ApiProperty({
    description: 'id доски',
    example: 1,
  })
  @IsNumber()
  id: 2;

  @ApiProperty({
    description: 'время создания доски',
    example: new Date(),
  })
  @IsDate()
  created: Date;

  @ApiProperty({
    description: 'время последнего изменения данных доски',
    example: new Date(),
  })
  @IsDate()
  updated: Date;
}

export class ResponseDashboardUserNumberDto extends ResponseCreateDashboardDto {
  @ApiProperty({
    description: 'id хозяина доски',
    example: 1,
  })
  @IsNumber()
  owner: number;
}

export class ResponseFindMyDashboardDto {
  @IsNumber()
  count: number;

  @ApiProperty({
    description: 'массив пользователей',
    isArray: true,
    type: ResponseDashboardUserNumberDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResponseDashboardUserNumberDto)
  dashboards: ResponseDashboardUserNumberDto[];
}
