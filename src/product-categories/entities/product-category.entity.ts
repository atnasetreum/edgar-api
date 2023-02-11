import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { MainProductCategory } from 'src/main-product-categories/entities/main-product-category.entity';

@Entity('product_categories')
@Unique(['name', 'mainProductCategory'])
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: number;

  @ManyToOne(
    () => MainProductCategory,
    (mainProductCategory) => mainProductCategory.productCategories,
  )
  mainProductCategory: MainProductCategory;
}
