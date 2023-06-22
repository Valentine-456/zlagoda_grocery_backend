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

@UseGuards(AuthGuard)
@Controller('/customer-card')
export class CustomerCardController {
  constructor(private readonly customerCardService: CustomerCardService) {}

  @Post()
  create(@Body() customerCardDto: CustomerCardDto) {
    return this.customerCardService.create(customerCardDto);
  }

  @Get()
  findAll(@Query('sortBy') sortBy?: string) {
    const sortBySQL = QueryParamUtils.sortByParamToSQL(sortBy);
    return this.customerCardService.findAll({ sortBy: sortBySQL });
  }

  @Get('searchBySurname/:surname')
  findBySurname(@Param('surname') surname: string) {
    return this.customerCardService.findBySurname(surname);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerCardService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() customerCardDto: CustomerCardDto) {
    return this.customerCardService.update(id, customerCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerCardService.remove(id);
  }
}
