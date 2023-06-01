import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { PG_CONNECTION } from './db/db.module';
import { Connection } from 'pg';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(PG_CONNECTION) private readonly conn: Connection,
  ) {}

  @Get()
  async getHello(): Promise<any> {
    const res: any = await this.conn.query('SELECT CURRENT_DATE;');
    return res.rows[0].current_date;
  }
}
