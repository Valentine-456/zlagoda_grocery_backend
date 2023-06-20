import { Module } from '@nestjs/common';
import { CheckService } from './check.service';
import { CheckController } from './check.controller';
import { DbModule } from 'src/db/db.module';
import { SaleService } from './sale.service';

@Module({
  imports: [DbModule],
  controllers: [CheckController],
  providers: [CheckService, SaleService],
})
export class CheckModule {}
