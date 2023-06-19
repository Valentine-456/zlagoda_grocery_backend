import { Module } from '@nestjs/common';
import { CustomerCardService } from './customer-card.service';
import { CustomerCardController } from './customer-card.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [CustomerCardController],
  providers: [CustomerCardService],
})
export class CustomerCardModule {}
