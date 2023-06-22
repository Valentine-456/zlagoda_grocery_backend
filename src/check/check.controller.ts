import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { CheckService } from './check.service';
import { CheckDto } from './dto/check.dto';
import { QueryParamUtils } from 'src/common/QueryParamUtils';
import { SaleService } from './sale.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { EmployeeRoles } from 'src/employee/entities/employee.roles';

@UseGuards(AuthGuard, RolesGuard)
@Controller('check')
export class CheckController {
  constructor(
    private readonly checkService: CheckService,
    private readonly saleService: SaleService,
  ) {}

  @Roles(EmployeeRoles.cashier)
  @Post()
  async create(@Body() checkDto: CheckDto) {
    const newCheck = await this.checkService.create(checkDto);
    const salesToCreate: Array<Promise<void>> = checkDto.sales.map((saleItem) =>
      this.saleService.create({
        ...saleItem,
        selling_price: 0,
        upc: saleItem.UPC,
        check_number: newCheck.check_number,
      }),
    );
    await Promise.allSettled(salesToCreate);

    const sum_total = await this.saleService.getSumOfSalesByManyChecks([
      newCheck.check_number,
    ]);
    return await this.checkService.update(newCheck.check_number, {
      ...newCheck,
      sum_total,
    });
  }

  @Roles(EmployeeRoles.manager)
  @Get()
  async findAll(@Query('sortBy') sortByQuery?: string) {
    const sortBy = QueryParamUtils.sortByParamToSQL(sortByQuery);
    return await this.checkService.findAll({ sortBy });
  }

  @Roles(EmployeeRoles.manager)
  @Get('/within')
  async findAllChecks(
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    if (!(fromDate || toDate))
      throw new BadRequestException(
        '"fromDate" and "toDate" query parameters are empty',
        {
          description: 'You need to specify both for this enpoint',
        },
      );
    return await this.checkService.getAllChecksWithinDate(
      null,
      fromDate,
      toDate,
    );
  }

  @Roles(EmployeeRoles.manager, EmployeeRoles.cashier)
  @Get('/within/:id')
  async findAllChecksByEmployee(
    @Param('id') id: string,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    if (!(fromDate || toDate))
      throw new BadRequestException(
        '"fromDate" and "toDate" query parameters are empty',
        {
          description: 'You need to specify both for this enpoint',
        },
      );
    return await this.checkService.getAllChecksWithinDate(id, fromDate, toDate);
  }

  @Roles(EmployeeRoles.manager)
  @Get('sum/within')
  async findSumOfAllChecks(
    @Param('id') id: string,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    if (!(fromDate || toDate))
      throw new BadRequestException(
        '"fromDate" and "toDate" query parameters are empty',
        {
          description: 'You need to specify both for this enpoint',
        },
      );
    return await this.checkService.getTotalSumOfAllChecks(fromDate, toDate);
  }

  @Roles(EmployeeRoles.manager)
  @Get('sum/within/:id')
  async findSumOfChecksByCashierId(
    @Param('id') id: string,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    if (!(fromDate || toDate))
      throw new BadRequestException(
        '"fromDate" and "toDate" query parameters are empty',
        {
          description: 'You need to specify both for this enpoint',
        },
      );
    return await this.checkService.getTotalSumOfChecksByEmployeeId(
      id,
      fromDate,
      toDate,
    );
  }
  @Roles(EmployeeRoles.manager, EmployeeRoles.cashier)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const salesExpanded = await this.checkService.findOne(id);
    if (salesExpanded.length == 0) return '';
    const {
      vat,
      sum_total,
      print_date,
      card_number,
      id_employee,
      check_number,
    } = salesExpanded[0];
    const check = {
      vat,
      sum_total,
      print_date,
      card_number,
      id_employee,
      check_number,
      sales: [],
    };
    check.sales = salesExpanded.map(
      ({
        product_name,
        charachteristics,
        upc,
        selling_price,
        product_number,
        promotional_product,
      }) => ({
        product_name,
        charachteristics,
        upc,
        selling_price,
        product_number,
        promotional_product,
      }),
    );
    return check;
  }

  @Roles(EmployeeRoles.manager)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.checkService.remove(id);
  }
}
