import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { CustomerCardModule } from './customer-card/customer-card.module';

@Module({
  imports: [
    DbModule,
    ConfigModule.forRoot(),
    CategoryModule,
    ProductModule,
    CustomerCardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
