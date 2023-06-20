import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeDto } from './dto/employee.dto';
import { QueryParamUtils } from 'src/common/QueryParamUtils';
import { PassEncryptionUtils } from 'src/common/PassEncryptionUtils';

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
