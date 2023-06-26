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
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { QueryParamUtils } from 'src/common/QueryParamUtils';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { EmployeeRoles } from 'src/employee/entities/employee.roles';

@UseGuards(AuthGuard, RolesGuard)
@Controller('/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(EmployeeRoles.manager)
  @Post()
  async create(@Body() productDto: ProductDto) {
    return await this.productService.create(productDto);
  }

  @Roles(EmployeeRoles.manager, EmployeeRoles.cashier)
  @Get()
  async findAll(
    @Query('sortBy') sortBy?: string,
    @Query('category') category: string = null,
  ) {
    const sqlSortBy: string = QueryParamUtils.sortByParamToSQL(sortBy);
    return await this.productService.findAll({ sortBy: sqlSortBy, category });
  }

  @Roles(EmployeeRoles.manager)
  @Get('/statistics/multiplePropositions')
  async findMultiplePropositionsSatistics(
    @Query('sortBy') sortBy?: string,
    @Query('category') category: string = null,
  ) {
    const sqlSortBy: string = QueryParamUtils.sortByParamToSQL(sortBy);
    return await this.productService.findMultiplePropositionsProducts({
      sortBy: sqlSortBy,
      category,
    });
  }

  @Roles(EmployeeRoles.cashier)
  @Get('searchByName/:name')
  async findByName(@Param('name') name: string) {
    return await this.productService.findByName(name);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    return await this.productService.findOne(+id);
  }

  @Roles(EmployeeRoles.manager)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() productDto: ProductDto,
  ) {
    return await this.productService.update(+id, productDto);
  }

  @Roles(EmployeeRoles.manager)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: string) {
    return await this.productService.remove(+id);
  }
}
