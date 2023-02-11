import { ProductCategory } from 'src/product-categories/entities/product-category.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('main_product_categories')
export class MainProductCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { unique: true })
  name: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: number;

  @OneToMany(
    () => ProductCategory,
    (productCategory) => productCategory.mainProductCategory,
  )
  productCategories: ProductCategory[];
}
