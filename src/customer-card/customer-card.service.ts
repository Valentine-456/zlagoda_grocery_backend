import { Inject, Injectable } from '@nestjs/common';
import { CustomerCardDto } from './dto/customer-card.dto';
import { APIQueryParams } from 'src/common/QueryParamUtils';
import { Pool, QueryResult } from 'pg';
import { PG_CONNECTION } from 'src/db/db.module';

@Injectable()
export class CustomerCardService {
  constructor(@Inject(PG_CONNECTION) private readonly dbPool: Pool) {}

  async create({
    card_number,
    cust_name,
    cust_surname,
    cust_patronimic = null,
    phone_number,
    city = null,
    street = null,
    zip_code = null,
    percent,
  }: CustomerCardDto) {
    const template = `INSERT INTO Customer_Card(
      card_number,
      cust_name,
      cust_surname,
      cust_patronimic,
      phone_number,
      city, 
      street,
      zip_code,
      percent
      ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`;
    const params = [
      card_number,
      cust_name,
      cust_surname,
      cust_patronimic,
      phone_number,
      city,
      street,
      zip_code,
      percent,
    ];
    const result = await this.dbPool.query(template, params);
    return result.rows[0];
  }

  async findAll({ sortBy }: APIQueryParams) {
    const result: QueryResult = await this.dbPool.query(
      `SELECT * FROM Customer_Card ${sortBy};`,
    );
    return result.rows;
  }

  async findBySurname(surname: string) {
    const result = await this.dbPool.query(
      `SELECT * FROM Customer_Card WHERE cust_surname = '${surname}';`,
    );
    return result.rows;
  }

  async findActiveCustomers() {
    const result = await this.dbPool.query(
      `SELECT *
      FROM Customer_Card AS C_C
      WHERE NOT EXISTS( SELECT id_employee
              FROM Employee AS E
              WHERE E.empl_role = 'CASHIER' and id_employee NOT IN ( SELECT id_employee
                      FROM public.Check AS C
                      WHERE C.card_number = C_C.card_number
              )
      );`,
    );
    return result.rows;
  }

  async findOne(id: string) {
    const template = 'SELECT * FROM Customer_Card WHERE card_number = $1;';
    const params = [id];
    const result = await this.dbPool.query(template, params);
    return result.rows[0];
  }

  async update(
    id: string,
    {
      card_number,
      cust_name,
      cust_surname,
      cust_patronimic = null,
      phone_number,
      city = null,
      street = null,
      zip_code = null,
      percent,
    }: CustomerCardDto,
  ) {
    const template = `UPDATE Customer_Card 
    SET card_number = $2,
    cust_name = $3,
    cust_surname = $4,
    cust_patronimic = $5,
    phone_number = $6,
    city = $7, 
    street = $8,
    zip_code = $9,
    percent = $10
    WHERE card_number = $1 RETURNING *;`;
    const params = [
      id,
      card_number,
      cust_name,
      cust_surname,
      cust_patronimic,
      phone_number,
      city,
      street,
      zip_code,
      percent,
    ];
    const result = await this.dbPool.query(template, params);
    return result.rows[0];
  }

  async remove(id: string) {
    const template =
      'DELETE FROM Customer_Card WHERE card_number = $1 RETURNING *;';
    const params = [id];
    const result = await this.dbPool.query(template, params);
    return result.rows[0];
  }
}
