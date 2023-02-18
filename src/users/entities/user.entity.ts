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
import { Comanda } from 'src/comandas/entities/comanda.entity';
import { Order } from 'src/comandas/entities';

@Entity('users')
@Unique(['name', 'userType'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('text')
  password: string;

  @Column({ default: false })
  complete: boolean;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @ManyToOne(() => UserType, (userType) => userType.users)
  userType: UserType;

  @OneToMany(() => Audit, (audit) => audit.user)
  audits: Audit[];

  @OneToMany(() => Comanda, (comanda) => comanda.user)
  comandas: Comanda[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await argon2.hash(this.password);
    }
  }
}
