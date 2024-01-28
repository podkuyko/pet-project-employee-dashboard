import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Dashboards } from 'src/dashboard/dashboard.entity';
import { Users } from 'src/users/users.entity';
import { CreateModeratorDto } from './dto/create-moderator.dto';

@Injectable()
export class ModeratorsService {
  constructor(
    @InjectRepository(Dashboards)
    private dashboardRepository: Repository<Dashboards>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async addModerator(
    ownerId: number,
    dashboardId: number,
    dto: CreateModeratorDto,
  ) {
    const dashboard = await this.dashboardRepository.findOne({
      where: { id: dashboardId },
      relations: { owner: true, moderators: true },
    });

    if (!dashboard || dashboard.id !== dashboardId) {
      throw new NotFoundException();
    }
    if (
      dashboard.owner.id !== ownerId &&
      !dashboard.moderators.some((moderator) => moderator.id === ownerId)
    ) {
      throw new ForbiddenException(
        'вы должны быть модератором или владельцем доски',
      );
    }

    const newModerator = await this.usersRepository.findOne({
      where: { id: dto.moderatorId },
    });

    if (!newModerator || newModerator.id !== dto.moderatorId) {
      throw new NotFoundException('новый модератор не существует');
    }

    dashboard.moderators = [...dashboard.moderators, newModerator];
    await this.dashboardRepository.save(dashboard);
    return 'ok';
  }

  async getModeratorsDashboard(ownerId: number, dashboardId: number) {
    const dashboard = await this.dashboardRepository
      .createQueryBuilder('dashboards')
      .where({ id: dashboardId })
      .innerJoinAndSelect('dashboards.owner', 'owner')
      .leftJoinAndSelect('dashboards.moderators', 'moderators')
      .select([
        'dashboards.id',

        'owner.id',

        'moderators.id',
        'moderators.firstName',
        'moderators.lastName',
        'moderators.patronymic',
        'moderators.gender',
        'moderators.email',
        'moderators.avatar',
        'moderators.phone',
      ])
      .getOne();

    if (!dashboard || dashboard.id !== dashboardId) {
      throw new NotFoundException();
    } else if (
      dashboard.owner.id !== ownerId &&
      !dashboard.moderators.some((moderator) => moderator.id === ownerId)
    ) {
      throw new ForbiddenException(
        'вы должны быть модератором или владельцем доски',
      );
    }

    return dashboard.moderators;
  }

  async removeModeratorToDashboard(
    userId: number,
    dashboardId: number,
    moderatorId: number,
  ) {
    const dashboard = await this.dashboardRepository.findOne({
      where: { id: dashboardId },
      relations: {
        moderators: true,
        owner: true,
      },
    });

    if (!dashboard || dashboard.id !== dashboardId) {
      throw new NotFoundException('dashboard not found');
    } else if (
      dashboard.owner.id !== userId &&
      !dashboard.moderators.some((moderator) => moderator.id === userId)
    ) {
      throw new ForbiddenException(
        'вы должны быть модератором или владельцем доски',
      );
    }

    await this.dashboardRepository.save({
      ...dashboard,
      moderators: dashboard.moderators.filter(
        (moderator) => moderator.id !== moderatorId,
      ),
    });
    return 'ok';
  }
}
