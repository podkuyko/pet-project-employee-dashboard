import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Users } from 'src/users/users.entity';
import { UsersModule } from 'src/users/users.module';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { Notes } from './notes.entity';
import { Dashboards } from 'src/dashboard/dashboard.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Notes, Users, Dashboards])],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
