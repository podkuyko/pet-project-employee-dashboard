import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notes } from './notes.entity';
import { ChangeNotesDto, CreateNotesDto } from './dto/create-notes.dto';
import { Dashboards } from 'src/dashboard/dashboard.entity';
import { log } from 'console';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Notes)
    private notesRepository: Repository<Notes>,
    @InjectRepository(Dashboards)
    private dashboardsRepository: Repository<Dashboards>,
  ) {}

  async addNotes(ownerId: number, dashboardId: number, dto: CreateNotesDto) {
    const dashboard = await this.dashboardsRepository.findOne({
      where: {
        id: dashboardId,
      },
      relations: {
        moderators: true,
        notes: true,
        owner: true,
      },
    });

    if (!dashboard || dashboard.id !== dashboardId) {
      throw new NotFoundException();
    } else if (
      dashboard.owner.id !== ownerId &&
      !dashboard.moderators.some((moderator) => moderator.id === ownerId)
    ) {
      throw new ForbiddenException();
    }

    await this.notesRepository.save({
      ...dto,
      dashboard,
    });
    return 'ok';
  }

  async getAllNotes(ownerId: number, dashboardId: number) {
    const dashboard = await this.dashboardsRepository.findOne({
      where: {
        id: dashboardId,
      },
      relations: {
        moderators: true,
        notes: true,
        owner: true,
      },
    });

    if (!dashboard || dashboard.id !== dashboardId) {
      throw new NotFoundException();
    } else if (
      dashboard.owner.id !== ownerId &&
      !dashboard.moderators.some((moderator) => moderator.id === ownerId)
    ) {
      throw new ForbiddenException();
    }

    return dashboard.notes;
  }

  async changeNotes(
    ownerId: number,
    dashboardId: number,
    notesId: number,
    dto: ChangeNotesDto,
  ) {
    const note = await this.notesRepository.findOne({
      where: {
        id: notesId,
        dashboard: {
          id: dashboardId,
        },
      },
      relations: {
        dashboard: { owner: true, moderators: true },
      },
    });

    if (!note || note.dashboard.id !== dashboardId) {
      throw new NotFoundException();
    } else if (
      note.dashboard.owner.id !== ownerId &&
      !note.dashboard.moderators.some((moderator) => moderator.id === ownerId)
    ) {
      throw new ForbiddenException();
    }

    await this.notesRepository.save({ ...note, ...dto });

    return 'ok';
  }

  async removeNotes(ownerId: number, dashboardId: number, notesId: number) {
    const note = await this.notesRepository.findOne({
      where: {
        id: notesId,
        dashboard: {
          id: dashboardId,
        },
      },
      relations: {
        dashboard: { owner: true, moderators: true },
      },
    });

    if (!note || note.dashboard.id !== dashboardId) {
      throw new NotFoundException();
    } else if (
      note.dashboard.owner.id !== ownerId &&
      !note.dashboard.moderators.some((moderator) => moderator.id === ownerId)
    ) {
      throw new ForbiddenException();
    }

    await this.notesRepository.remove(note);

    return 'ok';
  }
}
