import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { StoreProductService } from './store-product.service';
import { StoreProductDto } from './dto/store-product.dto';
import { QueryParamUtils } from 'src/common/QueryParamUtils';
import { StoreProduct } from './entities/store-product.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { EmployeeRoles } from 'src/employee/entities/employee.roles';

@UseGuards(AuthGuard, RolesGuard)
@Controller('store-product')
export class StoreProductController {
  constructor(private readonly storeProductService: StoreProductService) {}

  @Roles(EmployeeRoles.manager)
  @Post()
  async create(@Body() storeProductDto: StoreProductDto) {
    const similarStoreProducts: Array<StoreProduct> =
      await this.storeProductService.findByIdProduct(
        storeProductDto.id_product,
      );

    if (similarStoreProducts.length >= 2)
      throw new BadRequestException(
        'There already exist 2 batches of this product',
        {
          description:
            'Each product can only be in 2 batches in the store: regular and promotional one.',
        },
      );
    if (similarStoreProducts.length == 1) {
      const oldBatch = similarStoreProducts[0];
      const updateDTO: StoreProductDto = {
        UPC: oldBatch.upc,
        id_product: oldBatch.id_product,
        selling_price: oldBatch.selling_price,
        products_nubmer: oldBatch.products_nubmer,
        promotional_product: true,
      };
      await this.storeProductService.update(oldBatch.upc, updateDTO);

      const newStoreProductDto = { ...storeProductDto };
      newStoreProductDto.UPC_Prom = updateDTO.UPC;
      return await this.storeProductService.create(newStoreProductDto);
    }
    return await this.storeProductService.create(storeProductDto);
  }

  @Roles(EmployeeRoles.manager, EmployeeRoles.cashier)
  @Get()
  findAll(@Query('sortBy') sortByQuery?: string) {
    const sortBy = QueryParamUtils.sortByParamToSQL(sortByQuery);
    return this.storeProductService.findAll({ sortBy });
  }

  @Roles(EmployeeRoles.manager, EmployeeRoles.cashier)
  @Get('promotional')
  findAllPromotional(@Query('sortBy') sortByQuery?: string) {
    const sortBy = QueryParamUtils.sortByParamToSQL(sortByQuery);
    return this.storeProductService.findAllPromotional({ sortBy });
  }

  @Roles(EmployeeRoles.manager, EmployeeRoles.cashier)
  @Get('nonpromotional')
  findAllNonpromotional(@Query('sortBy') sortByQuery?: string) {
    const sortBy = QueryParamUtils.sortByParamToSQL(sortByQuery);
    return this.storeProductService.findAllNonpromotional({ sortBy });
  }

  @Roles(EmployeeRoles.manager, EmployeeRoles.cashier)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeProductService.findOne(id);
  }

  @Roles(EmployeeRoles.manager)
  @Patch(':id')
  update(@Param('id') id: string, @Body() storeProductDto: StoreProductDto) {
    return this.storeProductService.update(id, storeProductDto);
  }

  @Roles(EmployeeRoles.manager)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeProductService.remove(id);
  }
}
