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
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';
import { QueryParamUtils } from 'src/common/QueryParamUtils';

@Controller('/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() categoryDto: CategoryDto) {
    return await this.categoryService.create(categoryDto);
  }

  @Get()
  async findAll(@Query('sortBy') sortBy?: string) {
    const sortBySQL = QueryParamUtils.sortByParamToSQL(sortBy);
    return await this.categoryService.findAll({ sortBy: sortBySQL });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    return await this.categoryService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() categoryDto: CategoryDto,
  ) {
    return await this.categoryService.update(+id, categoryDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: string) {
    return await this.categoryService.remove(+id);
  }
}
