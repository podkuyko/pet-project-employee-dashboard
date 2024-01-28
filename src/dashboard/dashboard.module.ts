import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from 'src/users/users.module';
import { Users } from 'src/users/users.entity';
import { NotesModule } from 'src/notes/notes.module';
import { MembersModule } from 'src/members/members.module';
import { ModeratorsModule } from 'src/moderators/moderators.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Dashboards } from './dashboard.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dashboards, Users]),
    MembersModule,
    ModeratorsModule,
    NotesModule,
    UsersModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
