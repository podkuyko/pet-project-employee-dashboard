import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateModeratorDto {
  @ApiProperty({
    description: 'id модератора',
    example: 2,
    required: true,
  })
  @IsNumber()
  moderatorId: number;
}
