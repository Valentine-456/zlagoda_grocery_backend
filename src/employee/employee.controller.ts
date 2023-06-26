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
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeDto } from './dto/employee.dto';
import { QueryParamUtils } from 'src/common/QueryParamUtils';
import { PassEncryptionUtils } from 'src/common/PassEncryptionUtils';
import { EmployeeRoles } from './entities/employee.roles';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@UseGuards(AuthGuard, RolesGuard)
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Roles(EmployeeRoles.manager)
  @Post()
  async create(@Body() employeeDto: EmployeeDto) {
    if (!employeeDto.pass || employeeDto.pass.length == 0)
      throw new BadRequestException('You need a "pass" parameter specified');
    const passEncrypted = await PassEncryptionUtils.encryptPassword(
      employeeDto.pass,
    );
    employeeDto.pass = passEncrypted;
    return this.employeeService.create(employeeDto);
  }

  @Roles(EmployeeRoles.manager)
  @Get()
  findAll(@Query('sortBy') sortByQuery?: string) {
    const sortBy = QueryParamUtils.sortByParamToSQL(sortByQuery);
    return this.employeeService.findAll({ sortBy });
  }

  @Roles(EmployeeRoles.manager)
  @Get('position/:role')
  findAllEmployees(
    @Param('role', new ParseEnumPipe(EmployeeRoles)) role: string,
    @Query('sortBy') sortByQuery?: string,
  ) {
    const sortBy = QueryParamUtils.sortByParamToSQL(sortByQuery);
    return this.employeeService.findAllByPosition(role, { sortBy });
  }

  @Roles(EmployeeRoles.manager)
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

  @Roles(EmployeeRoles.cashier, EmployeeRoles.manager)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Roles(EmployeeRoles.manager)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() employeeDto: EmployeeDto) {
    let passEncrypted;
    if (!(!employeeDto.pass || employeeDto.pass.length == 0)) {
      passEncrypted = await PassEncryptionUtils.encryptPassword(
        employeeDto.pass,
      );
      employeeDto.pass = passEncrypted;
    } else employeeDto.pass = null;
    return this.employeeService.update(id, employeeDto);
  }

  @Roles(EmployeeRoles.manager)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }
}
