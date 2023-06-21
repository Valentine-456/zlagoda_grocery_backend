import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseEnumPipe,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeDto } from './dto/employee.dto';
import { QueryParamUtils } from 'src/common/QueryParamUtils';
import { PassEncryptionUtils } from 'src/common/PassEncryptionUtils';
import { EmployeeRoles } from './entities/employee.roles';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  async create(@Body() employeeDto: EmployeeDto) {
    const passEncrypted = await PassEncryptionUtils.encryptPassword(
      employeeDto.pass,
    );
    employeeDto.pass = passEncrypted;
    return this.employeeService.create(employeeDto);
  }

  @Get()
  findAll(@Query('sortBy') sortByQuery?: string) {
    const sortBy = QueryParamUtils.sortByParamToSQL(sortByQuery);
    return this.employeeService.findAll({ sortBy });
  }

  @Get('position/:role')
  findAllEmployees(
    @Param('role', new ParseEnumPipe(EmployeeRoles)) role: string,
    @Query('sortBy') sortByQuery?: string,
  ) {
    const sortBy = QueryParamUtils.sortByParamToSQL(sortByQuery);
    return this.employeeService.findAllByPosition(role, { sortBy });
  }

  @Get('searchBySurname/:surname')
  async findContactsBySurname(@Param('surname') surname: string) {
    const employees = await this.employeeService.findBySurname(surname);
    const contacts = employees.map(
      ({
        empl_name,
        empl_surname,
        id_employee,
        phone_number,
        city,
        street,
        zip_code,
      }) => ({
        empl_name,
        id_employee,
        empl_surname,
        phone_number,
        city,
        street,
        zip_code,
      }),
    );
    return contacts;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() employeeDto: EmployeeDto) {
    const passEncrypted = await PassEncryptionUtils.encryptPassword(
      employeeDto.pass,
    );
    employeeDto.pass = passEncrypted;
    return this.employeeService.update(id, employeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }
}
