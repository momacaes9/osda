import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Questionnaire } from '../../questionnaire/questionnaire.entity.js';
import { UserAuthentication } from '../../authentication/entities/userAuthentication.entity.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  /** bcrypt hash — never the plain password */
  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @Column({ type: 'varchar', length: 2, default: 'en' })
  language: string;

  @OneToMany(() => Questionnaire, (q) => q.user)
  questionnaires: Relation<Questionnaire[]>;

  @OneToMany(() => UserAuthentication, (a) => a.user)
  authentications: Relation<UserAuthentication[]>;

  @CreateDateColumn()
  createdAt: Date;
}
