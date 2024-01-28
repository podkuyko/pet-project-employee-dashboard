import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  Body,
  Post,
  NotFoundException,
  UseGuards,
  Delete,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { DashboardService } from './dashboard.service';
import {
  ResponseDashboardUserNumberDto,
  CreateDashboardDto,
  ResponseCreateDashboardDto,
  ResponseFindMyDashboardDto,
} from './dto/dashboard.dto';

import { DefaultAuthorizedGuard } from 'src/auth/guards/default-authorized.guard';
import { User } from 'src/auth/decorators/user.decorator';
import { UserId, Users } from 'src/users/users.entity';

@UseGuards(DefaultAuthorizedGuard)
@ApiBasicAuth('JWT-auth')
@ApiTags('dashboards')
@Controller('dashboards')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'dashboard успешно создан',
    type: ResponseCreateDashboardDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'введеные данные не валидны',
  })
  @ApiOperation({
    description: 'Создать новую доску',
    summary: 'Создать новую доску',
  })
  @UsePipes(ValidationPipe)
  @Post()
  async createDashboard(
    @Body() dto: CreateDashboardDto,
    @User() { id: userId }: UserId,
  ) {
    return this.dashboardService.create(dto, userId);
  }

  @ApiOperation({
    description: 'Получить все доступные доски',
    summary:
      'Получить все доступные доски (если ты в них модератор или хозяин)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'доски успешно получены',
    type: ResponseFindMyDashboardDto,
  })
  @Get()
  async getAll(@User() { id: userId }: Users) {
    return await this.dashboardService.getMyBoards(userId);
  }

  @ApiOperation({
    description: 'Получить информацию про существующую доску по id',
    summary: 'Получить информацию про существующую доску',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'доски успешно получены',
    type: ResponseDashboardUserNumberDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'нет доступа к доске',
  })
  @ApiParam({
    name: 'dashboardId',
    required: true,
    description: 'id доски',
    example: 1,
  })
  @Get(':dashboardId')
  async findById(
    @Param('dashboardId', ParseIntPipe) dashboardId: number,
    @User() { id: userId }: UserId,
  ) {
    const dashboard = await this.dashboardService.findMyBoardById(
      dashboardId,
      userId,
    );
    if (!dashboard) throw new NotFoundException();
    else return dashboard;
  }

  @ApiOperation({
    description: 'удалить доску',
    summary: 'удалить доску по id, (для этого нужно быть ее владельцем)',
  })
  @ApiParam({
    name: 'dashboardId',
    required: true,
    description: 'id доски',
    example: 1,
  })
  @Delete(':dashboardId')
  async delete(
    @Param('dashboardId', ParseIntPipe) dashboardId: number,
    @User() { id: userId }: UserId,
  ) {
    return await this.dashboardService.removeDashboard(userId, dashboardId);
  }
}
