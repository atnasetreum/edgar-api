import { ProductCategory } from 'src/product-categories/entities/product-category.entity';
import { MainProductCategory } from 'src/main-product-categories/entities/main-product-category.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ProductPrice } from './product-prices.entity';

@Entity('products')
@Unique(['name'])
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: number;

  @ManyToOne(() => MainProductCategory, (mpc) => mpc.products)
  mainCategory: MainProductCategory;

  @ManyToOne(() => ProductCategory, (pc) => pc.products)
  category: ProductCategory;

  @OneToMany(() => ProductPrice, (productPrice) => productPrice.product)
  prices: ProductPrice[];
}
