import { Inject, Injectable } from '@nestjs/common';
import { CheckDto } from './dto/check.dto';
import { Pool, QueryResult } from 'pg';
import { PG_CONNECTION } from 'src/db/db.module';
import { APIQueryParams } from 'src/common/QueryParamUtils';
import { Check } from './entities/check.entity';
import { SaleExpanded } from './entities/sale.entity';

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
      `SELECT * FROM public.Check
       ${sortBy};`,
    );
    return result.rows;
  }

  async findOne(id: string): Promise<Array<SaleExpanded>> {
    const result = await this.dbPool.query(
      `SELECT * FROM public.Check AS Ch
      LEFT JOIN Sale ON Ch.check_number = Sale.check_number
      LEFT JOIN Store_Product ON Store_Product.UPC = Sale.UPC
      LEFT JOIN Product ON Product.id_product = Store_Product.id_product
      WHERE Ch.check_number = $1;`,
      [id],
    );
    return result.rows;
  }

  async getAllChecksWithinDate(
    id_employee: string = null,
    fromDate: string,
    toDate: string,
  ) {
    const searchByEmployeeId =
      id_employee != null ? ` Ch.id_employee = '${id_employee}' AND ` : ' ';
    const result = await this.dbPool.query(
      `SELECT * FROM public.Check AS Ch
      WHERE ${searchByEmployeeId} Ch.print_date BETWEEN '${fromDate}' AND '${toDate}';`,
    );
    return result.rows;
  }

  async getTotalSumOfAllChecks(
    fromDate: string,
    toDate: string,
  ): Promise<number> {
    const result = await this.dbPool.query(
      `SELECT SUM(sum_total) FROM public.Check AS Ch
      WHERE Ch.print_date BETWEEN '${fromDate}' AND '${toDate}';`,
    );
    return result.rows[0].sum;
  }

  async getTotalSumOfChecksByEmployeeId(
    id: string,
    fromDate: string,
    toDate: string,
  ): Promise<number> {
    const result = await this.dbPool.query(
      `SELECT SUM(sum_total) FROM public.Check AS Ch
      WHERE Ch.id_employee = '${id}' 
      AND Ch.print_date BETWEEN '${fromDate}' AND '${toDate}';`,
    );
    return result.rows[0].sum;
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
      card_number = $3::VARCHAR,
      print_date = $4,
      sum_total = $5 * COALESCE( (100 - (
        SELECT percent FROM Customer_Card WHERE card_number = $3::VARCHAR
      )) /100 ::NUMERIC, 1)::NUMERIC
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
