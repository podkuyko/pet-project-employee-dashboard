import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { User } from 'src/auth/decorators/user.decorator';
import { DefaultAuthorizedGuard } from 'src/auth/guards/default-authorized.guard';
import { UserId } from 'src/users/users.entity';
import { ModeratorsService } from './moderators.service';
import { CreateModeratorDto } from './dto/create-moderator.dto';

@UseGuards(DefaultAuthorizedGuard)
@ApiBasicAuth('JWT-auth')
@ApiTags('dashboard-moderators')
@Controller('dashboard-moderators')
export class ModeratorsController {
  constructor(private readonly moderatorsService: ModeratorsService) {}

  @ApiOperation({
    description: 'добавить модератора',
    summary: 'добавить модератора на доску',
  })
  @ApiParam({
    name: 'dashboardId',
    required: true,
    description: 'id доски',
    example: 2,
  })
  @Post(':dashboardId')
  @UsePipes(ValidationPipe)
  async addModerator(
    @Param('dashboardId', ParseIntPipe) dashboardId: number,
    @User() { id: userId }: UserId,
    @Body() dto: CreateModeratorDto,
  ) {
    return await this.moderatorsService.addModerator(userId, dashboardId, dto);
  }

  @ApiOperation({
    description: 'получить модераторов',
    summary: 'получить модераторов доски',
  })
  @ApiParam({
    name: 'dashboardId',
    required: true,
    description: 'id доски',
    example: 2,
  })
  @Get(':dashboardId')
  async getModeratorsDashboard(
    @Param('dashboardId', ParseIntPipe) dashboardId: number,
    @User() { id: userId }: UserId,
  ) {
    return await this.moderatorsService.getModeratorsDashboard(
      userId,
      dashboardId,
    );
  }

  @ApiOperation({
    description: 'удалить модератора',
    summary: 'удалить модератора доски',
  })
  @ApiParam({
    name: 'dashboardId',
    required: true,
    description: 'id доски',
    example: 2,
  })
  @Delete(':dashboardId/:moderatorId')
  async removeModeratorToDashboard(
    @Param('dashboardId', ParseIntPipe) dashboardId: number,
    @Param('moderatorId', ParseIntPipe) moderatorId: number,
    @User() { id: userId }: UserId,
  ) {
    return await this.moderatorsService.removeModeratorToDashboard(
      userId,
      dashboardId,
      moderatorId,
    );
  }
}
