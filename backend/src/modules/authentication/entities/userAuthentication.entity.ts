import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';

/** One row per active login session (access + refresh token pair). */
@Entity('user_authentications')
export class UserAuthentication {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (u) => u.authentications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @Column({ type: 'int', name: 'user_id' })
  userId: number;

  @Column({ type: 'text', name: 'auth_token', nullable: true })
  authToken: string | null;

  @Column({ type: 'text', name: 'refresh_token', nullable: true })
  refreshToken: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  browser: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
