import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CustomerCardService } from './customer-card.service';
import { CustomerCardDto } from './dto/customer-card.dto';
import { QueryParamUtils } from 'src/common/QueryParamUtils';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { EmployeeRoles } from 'src/employee/entities/employee.roles';

@UseGuards(AuthGuard, RolesGuard)
@Controller('/customer-card')
export class CustomerCardController {
  constructor(private readonly customerCardService: CustomerCardService) {}

  @Roles(EmployeeRoles.manager, EmployeeRoles.cashier)
  @Post()
  create(@Body() customerCardDto: CustomerCardDto) {
    return this.customerCardService.create(customerCardDto);
  }

  @Get()
  findAll(@Query('sortBy') sortBy?: string) {
    const sortBySQL = QueryParamUtils.sortByParamToSQL(sortBy);
    return this.customerCardService.findAll({ sortBy: sortBySQL });
  }
  @Roles(EmployeeRoles.cashier)
  @Get('searchBySurname/:surname')
  findBySurname(@Param('surname') surname: string) {
    return this.customerCardService.findBySurname(surname);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerCardService.findOne(id);
  }

  @Roles(EmployeeRoles.manager, EmployeeRoles.cashier)
  @Patch(':id')
  update(@Param('id') id: string, @Body() customerCardDto: CustomerCardDto) {
    return this.customerCardService.update(id, customerCardDto);
  }

  @Roles(EmployeeRoles.manager)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerCardService.remove(id);
  }
}
