import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';

import { Dashboards } from 'src/dashboard/dashboard.entity';

export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  GUEST = 'guest',
}

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  patronymic: string;

  @Column({ type: 'enum', enum: UserGender, default: UserGender.MALE })
  gender: UserGender;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, default: null })
  avatar: string;

  @CreateDateColumn({ nullable: true, default: null })
  birthday: Date;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.GUEST })
  role: UserRole;

  @Column({ nullable: true, default: null })
  phone: number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToMany(() => Dashboards, ({ moderators }) => moderators, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  dashboards: Dashboards[];
}

export type UserId = Pick<Users, 'id'>;
