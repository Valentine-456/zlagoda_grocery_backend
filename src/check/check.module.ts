import { Module } from '@nestjs/common';
import { CheckService } from './check.service';
import { CheckController } from './check.controller';
import { DbModule } from 'src/db/db.module';
import { SaleService } from './sale.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DbModule, AuthModule],
  controllers: [CheckController],
  providers: [CheckService, SaleService],
})
export class CheckModule {}
