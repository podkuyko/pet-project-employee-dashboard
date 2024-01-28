import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Dashboards } from 'src/dashboard/dashboard.entity';
import { UsersModule } from 'src/users/users.module';
import { Users } from 'src/users/users.entity';
import { ModeratorsController } from './moderators.controller';
import { ModeratorsService } from './moderators.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Dashboards, Users])],
  controllers: [ModeratorsController],
  providers: [ModeratorsService],
})
export class ModeratorsModule {}
