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
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';
import { QueryParamUtils } from 'src/common/QueryParamUtils';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { EmployeeRoles } from 'src/employee/entities/employee.roles';
import { RolesGuard } from 'src/auth/roles.guard';

@UseGuards(AuthGuard, RolesGuard)
@Controller('/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(EmployeeRoles.manager)
  @Post()
  async create(@Body() categoryDto: CategoryDto) {
    return await this.categoryService.create(categoryDto);
  }

  @Roles(EmployeeRoles.manager)
  @Get()
  async findAll(@Query('sortBy') sortBy?: string) {
    const sortBySQL = QueryParamUtils.sortByParamToSQL(sortBy);
    return await this.categoryService.findAll({ sortBy: sortBySQL });
  }

  @Roles(EmployeeRoles.manager)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    return await this.categoryService.findOne(+id);
  }

  @Roles(EmployeeRoles.manager)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() categoryDto: CategoryDto,
  ) {
    return await this.categoryService.update(+id, categoryDto);
  }

  @Roles(EmployeeRoles.manager)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: string) {
    return await this.categoryService.remove(+id);
  }
}
