import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Members } from './members.entity';
import { Repository } from 'typeorm';

import { Dashboards } from 'src/dashboard/dashboard.entity';
import { ChangeMemberDto, CreateMemberDto } from './dto/create-member.dto';
import { log } from 'console';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Dashboards)
    private dashboardRepository: Repository<Dashboards>,
    @InjectRepository(Members)
    private membersRepository: Repository<Members>,
  ) {}

  async addMmemberToDashboard(
    userId: number,
    dashboardId: number,
    dto: CreateMemberDto,
  ) {
    const dashboard = await this.dashboardRepository.findOne({
      where: { id: dashboardId },
      relations: { owner: true, moderators: true },
    });

    if (!dashboard || dashboard.id !== dashboardId) {
      throw new NotFoundException();
    }

    if (
      dashboard.owner.id !== userId &&
      !dashboard.moderators.some((moderator) => moderator.id === userId)
    ) {
      throw new ForbiddenException();
    }
    await this.membersRepository.save({
      ...dto,
      dashboard,
    });

    return 'Ok';
  }

  async getMembersDashboard(userId: number, dashboardId: number) {
    const dashboard = await this.dashboardRepository.findOne({
      where: { id: dashboardId },
      relations: {
        members: true,
        owner: true,
      },
    });

    if (!dashboard || dashboard.id !== dashboardId) {
      throw new NotFoundException('dashboard not found');
    } else if (
      dashboard.owner.id !== userId &&
      !dashboard.moderators.some((moderator) => moderator.id === userId)
    ) {
      throw new ForbiddenException();
    }

    return dashboard.members;
  }
  async changeMemberToDashboard(
    userId: number,
    dashboardId: number,
    memberId: number,
    dto: ChangeMemberDto,
  ) {
    const member = await this.membersRepository.findOne({
      where: { dashboard: { id: dashboardId }, id: memberId },
      relations: {
        dashboard: {
          owner: true,
          moderators: true,
        },
      },
    });

    if (!member || member.id !== memberId) {
      throw new NotFoundException('member not found');
    } else if (
      member.dashboard.owner.id !== userId &&
      !member.dashboard.moderators.some((moderator) => moderator.id === userId)
    ) {
      throw new ForbiddenException();
    }

    await this.membersRepository.save({ ...member, ...dto });
    return 'ok';
  }

  async removeMmemberToDashboard(
    userId: number,
    dashboardId: number,
    memberId: number,
  ) {
    const member = await this.membersRepository.findOne({
      where: { dashboard: { id: dashboardId }, id: memberId },
      relations: {
        dashboard: {
          owner: true,
          moderators: true,
        },
      },
    });

    if (!member || member.id !== memberId) {
      throw new NotFoundException('member not found');
    } else if (
      member.dashboard.owner.id !== userId &&
      !member.dashboard.moderators.some((moderator) => moderator.id === userId)
    ) {
      throw new ForbiddenException();
    }

    await this.membersRepository.remove(member);
    return 'ok';
  }
}
