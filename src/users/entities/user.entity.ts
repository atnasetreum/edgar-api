import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  ManyToOne,
  Unique,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import * as argon2 from 'argon2';
import { UserType } from 'src/user-types/entities/user-type.entity';
import { Audit } from 'src/common/entities/audit.entity';

@Entity('users')
@Unique(['name', 'userType'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('text')
  password: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: number;

  @ManyToOne(() => UserType, (userType) => userType.users)
  userType: UserType;

  @OneToMany(() => Audit, (audit) => audit.user)
  audits: Audit[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await argon2.hash(this.password);
    }
  }
}
