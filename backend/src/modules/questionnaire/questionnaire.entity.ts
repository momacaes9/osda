import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { User } from '../users/entities/user.entity.js';

@Entity('questionnaires')
export class Questionnaire {
  @PrimaryGeneratedColumn()
  id: number;

  /** { "1": "A", "2": "C", ... } — question id -> option id */
  @Column('jsonb')
  answers: Record<string, string>;

  /** Language the questionnaire was answered in: 'en' | 'pt' */
  @Column({ type: 'varchar', length: 2, default: 'en' })
  language: string;

  @Column({ type: 'int', default: 0 })
  score: number;

  @Column({ type: 'varchar', length: 20, default: 'beginner' })
  level: string;

  /** Cached AI analysis, per language: { en?: string, pt?: string } */
  @Column({ type: 'jsonb', name: 'ai_response', nullable: true })
  aiResponse: Record<string, string> | null;

  @ManyToOne(() => User, (u) => u.questionnaires, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User> | null;

  @Column({ type: 'int', name: 'user_id', nullable: true })
  userId: number | null;

  @CreateDateColumn()
  createdAt: Date;
}
