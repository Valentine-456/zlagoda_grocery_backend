import { Injectable, Inject } from '@nestjs/common';
import { EmployeeDto } from './dto/employee.dto';
import { APIQueryParams } from 'src/common/QueryParamUtils';
import { PG_CONNECTION } from 'src/db/db.module';
import { Pool, QueryResult } from 'pg';

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
      pass
    ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *;`;
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
      pass,
    ];
    const result = await this.dbPool.query(template, params);
    return result.rows[0];
  }

  async findAll({ sortBy }: APIQueryParams) {
    const result = await this.dbPool.query(`SELECT * FROM Employee ${sortBy};`);
    return result.rows;
  }

  async findAllByPosition(role: string, { sortBy }: APIQueryParams) {
    const result = await this.dbPool.query(
      `SELECT * FROM Employee WHERE empl_role = '${role}' ${sortBy};`,
    );
    return result.rows;
  }

  async findBySurname(surname: string): Promise<Array<EmployeeDto>> {
    const result: QueryResult<EmployeeDto> = await this.dbPool.query(
      `SELECT * FROM Employee WHERE empl_surname = '${surname}';`,
    );
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
      pass,
    }: EmployeeDto,
  ) {
    const passwordUpdateSQL =
      !!pass && pass.length > 0 ? ` , pass = '${pass}' ` : ``;
    const template = `UPDATE Employee SET
      empl_name = '${empl_name}',
      empl_surname = '${empl_surname}',
      empl_patronimic = '${empl_patronimic}',
      empl_role = '${empl_role}',
      salary = ${salary},
      date_of_birth = '${date_of_birth}',
      date_of_start = '${date_of_start}',
      phone_number = '${phone_number}',
      city = '${city}',
      street = '${street}',
      zip_code = '${zip_code}' ${passwordUpdateSQL}
    WHERE id_employee = '${id}' RETURNING *;`;

    const result = await this.dbPool.query(template);
    return result.rows[0];
  }

  async remove(id: string) {
    const template = 'DELETE FROM Employee WHERE id_employee = $1 RETURNING *;';
    const params = [id];
    const result = await this.dbPool.query(template, params);
    return result.rows[0];
  }
}
