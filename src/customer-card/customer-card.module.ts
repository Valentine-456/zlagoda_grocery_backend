import { Module } from '@nestjs/common';
import { CustomerCardService } from './customer-card.service';
import { CustomerCardController } from './customer-card.controller';
import { DbModule } from 'src/db/db.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DbModule, AuthModule],
  controllers: [CustomerCardController],
  providers: [CustomerCardService],
})
export class CustomerCardModule {}
