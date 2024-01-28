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
import { NotesService } from './notes.service';
import { ChangeNotesDto, CreateNotesDto } from './dto/create-notes.dto';

@UseGuards(DefaultAuthorizedGuard)
@ApiBasicAuth('JWT-auth')
@ApiTags('dashboard-notes')
@Controller('dashboard-notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @ApiOperation({
    description: 'добавить заметку ',
    summary: 'добавить заметку о кадре на доску',
  })
  @ApiParam({
    name: 'dashboardId',
    required: true,
    description: 'id доски',
    example: 2,
  })
  @Post(':dashboardId')
  @UsePipes(ValidationPipe)
  async addNotes(
    @Param('dashboardId', ParseIntPipe) dashboardId: number,
    @Body() dto: CreateNotesDto,
    @User() { id: userId }: UserId,
  ) {
    return await this.notesService.addNotes(userId, dashboardId, dto);
  }

  @ApiOperation({
    description: 'получить все заметки',
    summary: 'получить все заметки на dashboard',
  })
  @ApiParam({
    name: 'dashboardId',
    required: true,
    description: 'id доски',
    example: 2,
  })
  @Get(':dashboardId')
  async getAllNotes(
    @Param('dashboardId', ParseIntPipe) dashboardId: number,
    @User() { id: userId }: UserId,
  ) {
    return await this.notesService.getAllNotes(userId, dashboardId);
  }

  @ApiOperation({
    description: 'изменить заметку',
    summary: 'изменить заметку',
  })
  @ApiParam({
    name: 'dashboardId',
    required: true,
    description: 'id доски',
    example: 2,
  })
  @ApiParam({
    name: 'notesId',
    required: true,
    description: 'id notes',
    example: 2,
  })
  @Patch(':dashboardId/:notesId')
  @UsePipes(ValidationPipe)
  async changeNotes(
    @Param('dashboardId', ParseIntPipe) dashboardId: number,
    @Param('notesId', ParseIntPipe) notesId: number,
    @Body() dto: ChangeNotesDto,
    @User() { id: userId }: UserId,
  ) {
    return await this.notesService.changeNotes(
      userId,
      dashboardId,
      notesId,
      dto,
    );
  }

  @ApiOperation({
    description: 'удалить заметку',
    summary: 'удалить заметку на доске',
  })
  @ApiParam({
    name: 'dashboardId',
    required: true,
    description: 'id доски',
    example: 2,
  })
  @ApiParam({
    name: 'notesId',
    required: true,
    description: 'id notes',
    example: 1,
  })
  @Delete(':dashboardId/:notesId')
  async removeNotes(
    @Param('dashboardId', ParseIntPipe) dashboardId: number,
    @Param('notesId', ParseIntPipe) notesId: number,
    @User() { id: userId }: UserId,
  ) {
    return await this.notesService.removeNotes(userId, dashboardId, notesId);
  }
}
