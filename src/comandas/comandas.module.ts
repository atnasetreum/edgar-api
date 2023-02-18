import { Module } from '@nestjs/common';
import { ComandasService } from './comandas.service';
import { ComandasController } from './comandas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from 'src/products/products.module';
import { Comanda, Order } from './entities';
import { OrderProduct } from './entities/order-products.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comanda, Order, OrderProduct]),
    ProductsModule,
  ],
  controllers: [ComandasController],
  providers: [ComandasService],
  exports: [TypeOrmModule, ComandasService],
})
export class ComandasModule {}
