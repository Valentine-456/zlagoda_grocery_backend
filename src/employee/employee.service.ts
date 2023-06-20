import { Injectable, Inject } from '@nestjs/common';
import { EmployeeDto } from './dto/employee.dto';
import { APIQueryParams } from 'src/common/QueryParamUtils';
import { PG_CONNECTION } from 'src/db/db.module';
import { Pool } from 'pg';

@Injectable()
export class EmployeeService {
  constructor(@Inject(PG_CONNECTION) private readonly dbPool: Pool) {}

  async create({
    id_employee,
    empl_name,
    empl_surname,
    empl_patronimic = null,
    empl_role,
    salary,
    date_of_birth,
    date_of_start,
    phone_number,
    city,
    street,
    zip_code,
    username,
    pass,
  }: EmployeeDto) {
    const template = `INSERT INTO Employee(
      id_employee,
      empl_name,
      empl_surname,
      empl_patronimic,
      empl_role,
      salary,
      date_of_birth,
      date_of_start,
      phone_number,
      city,
      street,
      zip_code,
      username,
      pass
    ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *;`;
    const params = [
      id_employee,
      empl_name,
      empl_surname,
      empl_patronimic,
      empl_role,
      salary,
      date_of_birth,
      date_of_start,
      phone_number,
      city,
      street,
      zip_code,
      username,
      pass,
    ];
    const result = await this.dbPool.query(template, params);
    return result.rows[0];
  }

  async findAll({ sortBy }: APIQueryParams) {
    const result = await this.dbPool.query(`SELECT * FROM Employee ${sortBy};`);
    return result.rows;
  }

  async findOne(id: string) {
    const template = 'SELECT * FROM Employee WHERE id_employee = $1;';
    const params = [id];
    const result = await this.dbPool.query(template, params);
    return result.rows[0];
  }

  async update(
    id: string,
    {
      empl_name,
      empl_surname,
      empl_patronimic = null,
      empl_role,
      salary,
      date_of_birth,
      date_of_start,
      phone_number,
      city,
      street,
      zip_code,
      username,
      pass,
    }: EmployeeDto,
  ) {
    const template = `UPDATE Employee SET
      empl_name = $2,
      empl_surname = $3,
      empl_patronimic = $4,
      empl_role = $5,
      salary = $6,
      date_of_birth = $7,
      date_of_start = $8,
      phone_number = $9,
      city = $10,
      street = $11,
      zip_code = $12,
      username = $13,
      pass = $14
    WHERE id_employee = $1 RETURNING *;`;
    const params = [
      id,
      empl_name,
      empl_surname,
      empl_patronimic,
      empl_role,
      salary,
      date_of_birth,
      date_of_start,
      phone_number,
      city,
      street,
      zip_code,
      username,
      pass,
    ];
    const result = await this.dbPool.query(template, params);
    return result.rows[0];
  }

  async remove(id: string) {
    const template = 'DELETE FROM Employee WHERE id_employee = $1 RETURNING *;';
    const params = [id];
    const result = await this.dbPool.query(template, params);
    return result.rows[0];
  }
}
