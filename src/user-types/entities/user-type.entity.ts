import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum EUserType {
  ADMIN = 'ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  MESERO = 'MESERO',
  COCINERO = 'COCINERO',
  MIXOLOGO = 'MIXOLOGO',
}

@Entity('userTypes')
export class UserType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    type: 'enum',
    enum: EUserType,
  })
  name: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @OneToMany(() => User, (user) => user.userType)
  users: User[];
}
