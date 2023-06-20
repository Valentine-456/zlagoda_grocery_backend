import { Inject, Injectable } from '@nestjs/common';
import { CheckDto } from './dto/check.dto';
import { Pool, QueryResult } from 'pg';
import { PG_CONNECTION } from 'src/db/db.module';
import { APIQueryParams } from 'src/common/QueryParamUtils';
import { Check } from './entities/check.entity';

@Injectable()
export class CheckService {
  constructor(@Inject(PG_CONNECTION) private readonly dbPool: Pool) {}

  async create({
    check_number,
    id_employee,
    card_number = null,
    print_date,
  }: CheckDto): Promise<Check> {
    const template = `INSERT INTO public.Check(
      check_number,
      id_employee,
      card_number,
      print_date,
      sum_total
    ) VALUES($1, $2, $3, $4, $5) RETURNING *;`;
    const params = [check_number, id_employee, card_number, print_date, 0.01];
    const result: QueryResult<Check> = await this.dbPool.query(
      template,
      params,
    );
    return result.rows[0];
  }

  async findAll({ sortBy }: APIQueryParams) {
    const result = await this.dbPool.query(
      `SELECT * FROM public.Check AS Ch
      INNER JOIN Sale ON Ch.check_number = Sale.check_number
      LEFT JOIN Store_Product ON Store_Product.UPC = Sale.UPC
      INNER JOIN Product ON Product.id_product = Store_Product.id_product
       ${sortBy};`,
    );
    return result.rows;
  }

  async findOne(id: string) {
    const result = await this.dbPool.query(
      `SELECT * FROM public.Check AS Ch
      INNER JOIN Sale ON Ch.check_number = Sale.check_number
      LEFT JOIN Store_Product ON Store_Product.UPC = Sale.UPC
      INNER JOIN Product ON Product.id_product = Store_Product.id_product
      WHERE Ch.check_number = $1;`,
      [id],
    );
    return result.rows;
  }

  async update(
    id: string,
    {
      check_number,
      id_employee,
      card_number = null,
      print_date,
      sum_total,
    }: Check,
  ) {
    const template = `UPDATE public.Check SET
      id_employee = $2,
      card_number = $3,
      print_date = $4,
      sum_total = $5
    WHERE check_number = $1 RETURNING *;`;
    const params = [
      check_number,
      id_employee,
      card_number,
      print_date,
      sum_total,
    ];
    const result = await this.dbPool.query(template, params);
    return result.rows[0];
  }

  async remove(id: string) {
    const template =
      'DELETE FROM public.Check WHERE check_number = $1 RETURNING *;';
    const params = [id];
    const result = await this.dbPool.query(template, params);
    return result.rows[0];
  }
}
