import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
  HttpStatus,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseUserDto, ResponseUsersDto } from './dto/response-user.dto';
import { DefaultAuthorizedGuard } from 'src/auth/guards/default-authorized.guard';
import { User } from 'src/auth/decorators/user.decorator';
import { Users } from './users.entity';

@ApiBasicAuth('JWT-auth')
@UseGuards(DefaultAuthorizedGuard)
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({
    description: 'Получить всех зарегистрированных пользователей системы',
    summary: 'получить всех уникальных пользователей',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'страница',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'колличество элементов на странице',
    example: 10,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'список пользователей получен',
    type: ResponseUsersDto,
  })
  @Get()
  async getAllUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit?: number,
  ) {
    return await this.userService.getAllUsers(page, limit);
  }

  @ApiOperation({
    description: 'получить информацию конкретного пользователя по id',
    summary: 'получить информацию по 1 пользователю',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'пользователь получен',
    type: ResponseUserDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'пользователь не найден',
  })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'id пользователя',
    example: 1,
  })
  @Get(':userId')
  async getUserById(@Param('userId', ParseIntPipe) userId: number) {
    const { password, ...userOmitPassword } =
      await this.userService.getUserById(userId);
    return userOmitPassword;
  }

  @ApiOperation({
    description: 'удалить свой акаунт',
    summary: 'удалить свой акаунт',
  })
  @Delete()
  async removeUser(@User() user: Users) {
    return await this.userService.removeUser(user.id);
  }
}
