import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Dashboards } from 'src/dashboard/dashboard.entity';
import { Users } from 'src/users/users.entity';
import { UsersModule } from 'src/users/users.module';
import { Members } from './members.entity';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Members, Users, Dashboards]),
  ],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
