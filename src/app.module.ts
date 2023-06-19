import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [DbModule, ConfigModule.forRoot(), CategoryModule, ProductModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
