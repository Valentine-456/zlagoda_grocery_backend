import { Module, Provider } from '@nestjs/common';
import { Pool } from 'pg';

export const PG_CONNECTION = 'PG_CONNECTION';

const dbPool = new Pool({
  user: process.env.POSTGRES_USER,
  host: 'postgres',
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

dbPool.on('connect', () => console.log('Successful connection with database'));
dbPool.on('error', (error) => console.log(error));

const dbProvider: Provider = {
  provide: PG_CONNECTION,
  useValue: dbPool,
};

@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DbModule {}
