import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CheckService } from './check.service';
import { CheckDto } from './dto/check.dto';
import { QueryParamUtils } from 'src/common/QueryParamUtils';
import { Sale } from './entities/sale.entity';
import { SaleService } from './sale.service';

@Controller('check')
export class CheckController {
  constructor(
    private readonly checkService: CheckService,
    private readonly saleService: SaleService,
  ) {}

  @Post()
  async create(@Body() checkDto: CheckDto) {
    console.log('Create check');
    const newCheck = await this.checkService.create(checkDto);
    console.log(newCheck);
    console.log('Create Sales');
    const salesToCreate: Array<Promise<Sale>> = checkDto.sales.map((saleItem) =>
      this.saleService.create({
        ...saleItem,
        selling_price: 0,
        upc: saleItem.UPC,
        check_number: newCheck.check_number,
      }),
    );
    await Promise.allSettled(salesToCreate);

    console.log('Sum Sale');
    const sum_total = await this.saleService.getSumOfSalesByManyChecks([
      newCheck.check_number,
    ]);
    console.log('UPDATE Check');
    return await this.checkService.update(newCheck.check_number, {
      ...newCheck,
      sum_total,
    });
  }

  @Get()
  async findAll(@Query('sortBy') sortByQuery?: string) {
    const sortBy = QueryParamUtils.sortByParamToSQL(sortByQuery);
    return await this.checkService.findAll({ sortBy });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.checkService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.checkService.remove(id);
  }
}
