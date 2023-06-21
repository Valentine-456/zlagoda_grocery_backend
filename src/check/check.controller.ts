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
import { SaleService } from './sale.service';

@Controller('check')
export class CheckController {
  constructor(
    private readonly checkService: CheckService,
    private readonly saleService: SaleService,
  ) {}

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

  // TODO:
  // ?DELETE
  @Get()
  async findAll(@Query('sortBy') sortByQuery?: string) {
    const sortBy = QueryParamUtils.sortByParamToSQL(sortByQuery);
    return await this.checkService.findAll({ sortBy });
  }

  // TODO:
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.checkService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.checkService.remove(id);
  }
}
