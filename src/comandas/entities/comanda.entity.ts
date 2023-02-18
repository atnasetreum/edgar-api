import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Order } from './order.entity';

@Entity('comandas')
export class Comanda {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mesa: number;

  @Column('text', { default: 'En progreso' })
  state: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @ManyToOne(() => User, (user) => user.comandas)
  user: User;

  @ManyToMany(() => Product)
  @JoinTable({ name: 'comanda_products' })
  products: Product[];

  @ManyToMany(() => Order)
  @JoinTable({ name: 'comanda_orders' })
  orders: Order[];
}
