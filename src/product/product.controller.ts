import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';

@Controller('/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() productDto: ProductDto) {
    return await this.productService.create(productDto);
  }

  @Get()
  async findAll() {
    return await this.productService.findAll();
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
