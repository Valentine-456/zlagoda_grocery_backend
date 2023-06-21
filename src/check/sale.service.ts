import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from 'src/db/db.module';
import { Sale } from './entities/sale.entity';

@Injectable()
export class SaleService {
  constructor(@Inject(PG_CONNECTION) private readonly dbPool: Pool) {}

  async create({ upc, check_number, product_number }: Sale) {
    const client = await this.dbPool.connect();
    try {
      await client.query('BEGIN');

      const templateUpdate = `UPDATE Store_Product SET
        products_nubmer = products_nubmer - $2
        WHERE UPC = $1;`;
      const paramsUpdate = [upc, product_number];
      await client.query(templateUpdate, paramsUpdate);

      const templateInsert = `INSERT INTO Sale(
        UPC,
        check_number,
        product_number,
        selling_price
      ) VALUES( $1::VARCHAR, $2, $3, (
            SELECT CASE
                WHEN promotional_product
                THEN Store_Product.selling_price * 0.8
                ELSE Store_Product.selling_price
            END 
            FROM Store_Product
            WHERE Store_Product.UPC = $1::VARCHAR
      )) RETURNING *;`;
      const paramsInsert = [upc, check_number, product_number];
      await client.query(templateInsert, paramsInsert);

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // TODO:
  // async getAllByCheckId(){}

  async getSumOfSalesByManyChecks(checksIDs: Array<string>): Promise<number> {
    let checksIDsSQL = `( `;
    checksIDs.forEach((id, i) => {
      if (i != checksIDs.length - 1) checksIDsSQL += `'${id}', `;
      else checksIDsSQL += `'${id}' )`;
    });

    console.log(`SELECT SUM(selling_price * product_number) FROM Sale
    WHERE check_number IN ${checksIDsSQL};`);

    const result = await this.dbPool.query(
      `SELECT SUM(selling_price * product_number) FROM Sale
      WHERE check_number IN ${checksIDsSQL};`,
    );
    console.log(result);
    return result.rows[0].sum;
  }

  //   async findAll({ sortBy }: APIQueryParams) {
  //     const result = await this.dbPool.query(
  //       `SELECT * FROM public.Check AS Ch
  //           INNER JOIN Sale ON Ch.check_number = Sale.check_number
  //           LEFT JOIN Store_Product ON Store_Product.UPC = Sale.UPC
  //           INNER JOIN Product ON Product.id_product = Store_Product.id_product
  //            ${sortBy};`,
  //     );
  //     return result.rows;
  //   }

  //   async findOne(id: string) {
  //     const result = await this.dbPool.query(
  //       `SELECT * FROM public.Check AS Ch
  //           INNER JOIN Sale ON Ch.check_number = Sale.check_number
  //           LEFT JOIN Store_Product ON Store_Product.UPC = Sale.UPC
  //           INNER JOIN Product ON Product.id_product = Store_Product.id_product
  //           WHERE Ch.check_number = $1;`,
  //       [id],
  //     );
  //     return result.rows;
  //   }
}
