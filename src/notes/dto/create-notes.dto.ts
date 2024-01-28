import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ChangeNotesDto {
  @ApiProperty({
    description: 'цвет заметки в формате #0000',
    required: false,
    example: '#0000',
  })
  @IsString()
  @IsOptional()
  color: string;

  @ApiProperty({
    description: 'Заголовок заметки',
    required: false,
    example: 'Отпросился',
  })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({
    description: 'Описание  заметки',
    required: false,
    example: 'Отпросился по личным делам, напомнить Джулии об этом',
  })
  @IsString()
  @IsOptional()
  description: string;
}

export class CreateNotesDto implements ChangeNotesDto {
  @ApiProperty({
    description: 'цвет заметки в формате #0000',
    required: true,
    example: '#0000',
  })
  @IsString()
  color: string;

  @ApiProperty({
    description: 'Заголовок заметки',
    required: true,
    example: 'Отпросился',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Описание  заметки',
    required: false,
    example: 'Вернется днем',
  })
  @IsString()
  description: string;
}
