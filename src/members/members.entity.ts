import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { Notes } from 'src/notes/notes.entity';
import { Dashboards } from 'src/dashboard/dashboard.entity';

@Entity()
export class Members {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToOne(() => Dashboards, ({ members }) => members)
  dashboard: Dashboards;

  @ManyToMany(() => Notes, ({ member }) => member)
  @JoinTable()
  notes: Notes[];
}
