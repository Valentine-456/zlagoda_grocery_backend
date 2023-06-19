import { Inject, Injectable } from '@nestjs/common';
import { ProductDto } from './dto/product.dto';
import { Pool, QueryResult } from 'pg';
import { PG_CONNECTION } from 'src/db/db.module';
import { APIQueryParams } from 'src/common/QueryParamUtils';

@Injectable()
export class ProductService {
  constructor(@Inject(PG_CONNECTION) private readonly dbPool: Pool) {}

  async create(productDto: ProductDto) {
    const { product_name, category_number, charachteristics } = productDto;
    const template =
      'INSERT INTO Product(product_name, charachteristics, category_number) VALUES($1, $2, $3) RETURNING *;';
    const params = [product_name, charachteristics, category_number];
    const result = await this.dbPool.query(template, params);
    return result.rows[0];
  }

  async findAll({ sortBy }: APIQueryParams) {
    const result: QueryResult = await this.dbPool.query(
      `SELECT * FROM Product ${sortBy};`,
    );
    return result.rows;
  }

  async findOne(id: number) {
    const template = 'SELECT * FROM Product WHERE "id_product" = $1;';
    const params = [id];
    const result = await this.dbPool.query(template, params);
    return result.rows[0];
  }

  async update(id: number, productDto: ProductDto) {
    const template = `UPDATE Product 
      SET category_number = $2,
      charachteristics = $3,
      product_name = $4
      WHERE id_product = $1 RETURNING *;`;
    const { category_number, charachteristics, product_name } = productDto;
    const params = [id, category_number, charachteristics, product_name];
    const result = await this.dbPool.query(template, params);
    return result.rows[0];
  }

  async remove(id: number) {
    const template = 'DELETE FROM Product WHERE id_product = $1 RETURNING *;';
    const params = [id];
    const result = await this.dbPool.query(template, params);
    return result.rows[0];
  }
}
