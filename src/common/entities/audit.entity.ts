import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

export enum EMethodNames {
  CREATE = 'Creacion',
  UPDATE = 'Actualizacion',
  DELETE = 'Eliminacion',
}

@Entity('audits')
export class Audit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  methodName: string;

  @Column('jsonb', { default: {} })
  data: object;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: number;

  @ManyToOne(() => User, (user) => user.audits)
  user: User;
}
