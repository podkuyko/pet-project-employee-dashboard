import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { User } from 'src/auth/decorators/user.decorator';
import { DefaultAuthorizedGuard } from 'src/auth/guards/default-authorized.guard';
import { UserId } from 'src/users/users.entity';
import { MembersService } from './members.service';
import { ChangeMemberDto, CreateMemberDto } from './dto/create-member.dto';

@UseGuards(DefaultAuthorizedGuard)
@ApiBasicAuth('JWT-auth')
@ApiTags('dashboard-members')
@Controller('dashboard-members')
export class MembersController {
  constructor(private readonly memberService: MembersService) {}

  @ApiOperation({
    description: 'добавить кадр на доску',
    summary:
      'добавить ногового кадра на доску, для этого нужно быть хозяином или модератором',
  })
  @ApiParam({
    name: 'dashboardId',
    required: true,
    description: 'id доски',
    example: 2,
  })
  @Post(':dashboardId')
  @UsePipes(ValidationPipe)
  async addMemberToDashboard(
    @Param('dashboardId', ParseIntPipe) dashboardId: number,
    @Body() dto: CreateMemberDto,
    @User() { id }: UserId,
  ) {
    return await this.memberService.addMmemberToDashboard(id, dashboardId, dto);
  }

  @ApiOperation({
    description: 'получить все кадры доски',
    summary: 'получить все кадры доски',
  })
  @ApiParam({
    name: 'dashboardId',
    required: true,
    description: 'id доски',
    example: 2,
  })
  @Get(':dashboardId')
  async getMembersDashboard(
    @Param('dashboardId', ParseIntPipe) dashboardId: number,
    @User() { id: userId }: UserId,
  ) {
    return await this.memberService.getMembersDashboard(userId, dashboardId);
  }

  @ApiOperation({
    description: 'изменить данные кадра',
    summary: 'изменить данные кадра',
  })
  @ApiParam({
    name: 'dashboardId',
    required: true,
    description: 'id доски',
    example: 2,
  })
  @ApiParam({
    name: 'memberId',
    required: true,
    description: 'id кадра',
    example: 1,
  })
  @Patch(':dashboardId/:memberId')
  @UsePipes(ValidationPipe)
  async changeMmemberToDashboard(
    @Param('dashboardId', ParseIntPipe) dashboardId: number,
    @Param('memberId', ParseIntPipe) memberId: number,
    @Body() dto: ChangeMemberDto,
    @User() { id: userId }: UserId,
  ) {
    return await this.memberService.changeMemberToDashboard(
      userId,
      dashboardId,
      memberId,
      dto,
    );
  }

  @ApiOperation({
    description: 'удалить кадр',
    summary: 'удалить кадр',
  })
  @ApiParam({
    name: 'dashboardId',
    required: true,
    description: 'id доски',
    example: 2,
  })
  @ApiParam({
    name: 'memberId',
    required: true,
    description: 'id кадра',
    example: 1,
  })
  @Delete(':dashboardId/:memberId')
  async removeMmemberToDashboard(
    @Param('dashboardId', ParseIntPipe) dashboardId: number,
    @Param('memberId', ParseIntPipe) memberId: number,
    @User() { id: userId }: UserId,
  ) {
    return await this.memberService.removeMmemberToDashboard(
      userId,
      dashboardId,
      memberId,
    );
  }
}
