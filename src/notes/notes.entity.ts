import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';

import { Dashboards } from 'src/dashboard/dashboard.entity';
import { Members } from 'src/members/members.entity';

@Entity()
export class Notes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  color: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToOne(() => Dashboards, ({ notes }) => notes)
  dashboard: Dashboards;

  @ManyToMany(() => Members, ({ notes }) => notes)
  member: Members[];
}
