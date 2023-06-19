import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { QueryParamUtils } from 'src/common/QueryParamUtils';

@Controller('/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() productDto: ProductDto) {
    return await this.productService.create(productDto);
  }

  @Get()
  async findAll(@Query('sortBy') sortBy?: string) {
    const sqlSortBy: string = QueryParamUtils.sortByParamToSQL(sortBy);
    return await this.productService.findAll({ sortBy: sqlSortBy });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    return await this.productService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() productDto: ProductDto,
  ) {
    return await this.productService.update(+id, productDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: string) {
    return await this.productService.remove(+id);
  }
}
