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
    try {
      const res: any = await this.conn.query('SELECT * FROM users;');
      return res.rows;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
