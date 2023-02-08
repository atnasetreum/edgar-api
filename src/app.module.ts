import { Module } from '@nestjs/common';
import { UserTypesModule } from './user-types/user-types.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration, JoiValidationSchema } from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MainProductCategoriesModule } from './main-product-categories/main-product-categories.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { ProductsModule } from './products/products.module';
import { ProductPricesModule } from './product-prices/product-prices.module';
import { HistoriesModule } from './histories/histories.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    UserTypesModule,
    MainProductCategoriesModule,
    ProductCategoriesModule,
    ProductsModule,
    ProductPricesModule,
    HistoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
