import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

import { Users } from 'src/users/users.entity';
import { Notes } from 'src/notes/notes.entity';
import { Members } from 'src/members/members.entity';

@Entity()
export class Dashboards {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToOne(() => Users, ({ id }) => id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  owner: Users;

  @ManyToMany(() => Users, ({ dashboards }) => dashboards)
  @JoinTable()
  moderators: Users[];

  @OneToMany(() => Members, ({ dashboard }) => dashboard, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  members: Users[];

  @OneToMany(() => Notes, ({ dashboard }) => dashboard, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  notes: Notes[];
}
