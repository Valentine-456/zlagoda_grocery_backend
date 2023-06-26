import { join } from 'path';
import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { CustomerCardModule } from './customer-card/customer-card.module';
import { EmployeeModule } from './employee/employee.module';
import { StoreProductModule } from './store-product/store-product.module';
import { CheckModule } from './check/check.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    DbModule,
    ConfigModule.forRoot(),
    CategoryModule,
    ProductModule,
    CustomerCardModule,
    EmployeeModule,
    StoreProductModule,
    CheckModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
