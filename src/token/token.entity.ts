import { Users } from '../users/users.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Tokens {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  date: string;

  @ManyToOne(() => Users, ({ id }) => id, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: number;
}
