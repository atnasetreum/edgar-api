import { ProductCategory } from 'src/product-categories/entities/product-category.entity';
import { MainProductCategory } from 'src/main-product-categories/entities/main-product-category.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ProductPrice } from './product-prices.entity';
import { Order } from 'src/comandas/entities';
import { OrderProduct } from 'src/comandas/entities/order-products.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { unique: true })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @ManyToOne(() => MainProductCategory, (mpc) => mpc.products)
  mainCategory: MainProductCategory;

  @ManyToOne(() => ProductCategory, (pc) => pc.products)
  category: ProductCategory;

  @OneToMany(() => ProductPrice, (productPrice) => productPrice.product)
  prices: ProductPrice[];

  @OneToMany(() => OrderProduct, (order) => order.product)
  orders: Order[];
}
