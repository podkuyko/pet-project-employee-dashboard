import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Dashboards } from './dashboard.entity';
import { CreateDashboardDto } from './dto/dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Dashboards)
    private dashboardRepository: Repository<Dashboards>,
  ) {}

  schemaSelectDashboard = [
    'dashboards.id',
    'dashboards.title',
    'dashboards.description',

    'owner.id',
    'owner.firstName',
    'owner.lastName',
    'owner.patronymic',
    'owner.gender',
    'owner.email',
    'owner.avatar',
    'owner.phone',

    'moderators.id',
    'moderators.firstName',
    'moderators.lastName',
    'moderators.patronymic',
    'moderators.gender',
    'moderators.email',
    'moderators.avatar',
    'moderators.phone',

    'members.id',
    'members.firstName',
    'members.lastName',
  ];

  async getMyBoards(userId: number) {
    const [dashboards, count] = await this.dashboardRepository
      .createQueryBuilder('dashboards')
      .where({ owner: { id: userId } })
      .orWhere('moderators.id = :userId', { userId })
      .innerJoinAndSelect('dashboards.owner', 'owner')
      .leftJoinAndSelect('dashboards.moderators', 'moderators')
      .leftJoinAndSelect('dashboards.members', 'members')
      .select(this.schemaSelectDashboard)
      .getManyAndCount();

    return { dashboards, count };
  }

  async findMyBoardById(
    boardId: number,
    userId: number,
  ): Promise<Dashboards | null> {
    const board = await this.dashboardRepository
      .createQueryBuilder('dashboards')
      .where({ owner: { id: userId }, id: boardId })
      .orWhere('moderators.id = :userId', { userId })
      .innerJoinAndSelect('dashboards.owner', 'owner')
      .leftJoinAndSelect('dashboards.moderators', 'moderators')
      .leftJoinAndSelect('dashboards.members', 'members')
      .select(this.schemaSelectDashboard)
      .getOne();

    if (!board) {
      throw new NotFoundException();
    }
    return board;
  }

  async create(dto: CreateDashboardDto, userId: number): Promise<Dashboards> {
    return await this.dashboardRepository.save({
      ...dto,
      owner: { id: userId },
    });
  }

  async removeDashboard(userId: number, dashboardId: number) {
    const dashboard = await this.dashboardRepository.findOne({
      where: { id: dashboardId },
      loadRelationIds: true,
    });

    if (!dashboard || dashboard.id !== dashboardId) {
      throw new NotFoundException();
    }
    if (Number(dashboard.owner) !== userId) {
      throw new ForbiddenException('у вас нет доступа к этой доске');
    }

    await this.dashboardRepository.remove(dashboard);
  }
}
