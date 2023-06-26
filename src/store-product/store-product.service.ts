import { Inject, Injectable } from '@nestjs/common';
import { StoreProductDto } from './dto/store-product.dto';
import { APIQueryParams } from 'src/common/QueryParamUtils';
import { Pool } from 'pg';
import { PG_CONNECTION } from 'src/db/db.module';

@Injectable()
export class StoreProductService {
  constructor(@Inject(PG_CONNECTION) private readonly dbPool: Pool) {}
  async create({
    UPC,
    id_product,
    selling_price,
    products_nubmer,
    promotional_product = false,
    UPC_Prom = null,
  }: StoreProductDto) {
    const template = `INSERT INTO Store_Product(
      UPC,
      id_product,
      selling_price,
      products_nubmer,
      promotional_product,
      UPC_Prom
    ) VALUES($1, $2, $3, $4, $5, $6) RETURNING *;`;
    const params = [
      UPC,
      id_product,
      selling_price,
      products_nubmer,
      promotional_product,
      UPC_Prom,
    ];
    const result = await this.dbPool.query(template, params);
    return result.rows[0];
  }

  async findAll({ sortBy }: APIQueryParams) {
    const result = await this.dbPool.query(
      `SELECT * FROM Store_Product
      INNER JOIN Product ON Product.id_product = Store_Product.id_product
       ${sortBy};`,
    );
    return result.rows;
  }

  async findAllNonpromotional({ sortBy }: APIQueryParams) {
    const result = await this.dbPool.query(
      `SELECT * FROM Store_Product
      INNER JOIN Product ON Product.id_product = Store_Product.id_product
      WHERE Store_Product.promotional_product = false 
       ${sortBy};`,
    );
    return result.rows;
  }

  async findAllPromotional({ sortBy }: APIQueryParams) {
    const result = await this.dbPool.query(
      `SELECT * FROM Store_Product
      INNER JOIN Product ON Product.id_product = Store_Product.id_product
      WHERE Store_Product.promotional_product = true 
       ${sortBy};`,
    );
    return result.rows;
  }

  async findByIdProduct(id_product: number) {
    const result = await this.dbPool.query(
      `SELECT * FROM Store_Product
       INNER JOIN Product ON Product.id_product = Store_Product.id_product
       WHERE Product.id_product = $1;`,
      [id_product],
    );
    return result.rows;
  }

  async findOne(id: string) {
    const result = await this.dbPool.query(
      `SELECT * FROM Store_Product
      INNER JOIN Product ON Product.id_product = Store_Product.id_product
      WHERE Store_Product.UPC = $1;`,
      [id],
    );
    return result.rows[0];
  }

  async update(
    id: string,
    {
      UPC,
      id_product,
      selling_price,
      products_nubmer,
      promotional_product,
      UPC_Prom,
    }: StoreProductDto,
  ) {
    const template = `UPDATE Store_Product SET
      UPC = $2,
      id_product = $3,
      selling_price = $4,
      products_nubmer = $5,
      promotional_product = $6,
      UPC_Prom = $7
      WHERE UPC = $1 RETURNING *;`;
    const params = [
      id,
      UPC,
      id_product,
      selling_price,
      products_nubmer,
      promotional_product || false,
      UPC_Prom || null,
    ];
    const result = await this.dbPool.query(template, params);
    return result.rows[0];
  }

  async remove(id: string) {
    const template = 'DELETE FROM Store_Product WHERE UPC = $1 RETURNING *;';
    const params = [id];
    const result = await this.dbPool.query(template, params);
    return result.rows[0];
  }
}
