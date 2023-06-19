import { Inject, Injectable } from '@nestjs/common';
import { CategoryDto } from './dto/category.dto';
import { PG_CONNECTION } from '../db/db.module';
import { Pool, QueryResult } from 'pg';

@Injectable()
export class CategoryService {
  constructor(@Inject(PG_CONNECTION) private readonly dbPool: Pool) {}

  async create(categoryDto: CategoryDto) {
    const template =
      'INSERT INTO Category(category_name) VALUES($1) RETURNING *;';
    const params = [categoryDto.category_name];
    const result = await this.dbPool.query(template, params);
    return result.rows[0];
  }

  async findAll() {
    const result: QueryResult = await this.dbPool.query(
      'SELECT * FROM Category;',
    );
    return result.rows;
  }

  async findOne(id: number) {
    const template = 'SELECT * FROM Category WHERE "category_number" = $1;';
    const params = [id];
    const result = await this.dbPool.query(template, params);
    return result.rows[0];
  }

  async update(id: number, categoryDto: CategoryDto) {
    const template =
      'UPDATE Category SET category_name = $1 WHERE category_number = $2 RETURNING *;';
    const { category_name } = categoryDto;
    const params = [category_name, id];
    const result = await this.dbPool.query(template, params);
    return result.rows[0];
  }

  async remove(id: number) {
    const template =
      'DELETE FROM Category WHERE category_number = $1 RETURNING *;';
    const params = [id];
    const result = await this.dbPool.query(template, params);
    return result.rows[0];
  }
}
