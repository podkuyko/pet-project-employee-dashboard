import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ChangeMemberDto {
  @ApiProperty({
    description: 'Имя кадра',
    example: 'Svetlana',
    required: false,
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'фамилия кадра',
    example: 'Пупкина',
    required: false,
  })
  @IsString()
  @IsOptional()
  lastName?: string;
}

export class CreateMemberDto implements ChangeMemberDto {
  @ApiProperty({
    description: 'Имя кадра',
    example: 'Svetlana',
    required: true,
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'фамилия кадра',
    example: 'Пупкина',
    required: true,
  })
  @IsString()
  lastName: string;
}
