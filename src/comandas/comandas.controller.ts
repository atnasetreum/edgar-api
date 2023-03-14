import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtValidateGuard } from 'src/auth/guards';
import { ComandasService } from './comandas.service';
import {
  AddOrderDto,
  CreateComandaDto,
  QueryComandaDto,
  QueryOrderDto,
  UpdateComandaDto,
} from './dto';

@Controller('comandas')
@UseGuards(JwtValidateGuard)
export class ComandasController {
  constructor(private readonly comandasService: ComandasService) {}

  @Post()
  create(@Body() createComandaDto: CreateComandaDto) {
    return this.comandasService.create(createComandaDto);
  }

  @Post('add-order')
  addOrder(@Body() addOrderDto: AddOrderDto) {
    return this.comandasService.addOrder(addOrderDto);
  }

  @Post('orders/complete/:id')
  completeOrder(@Param('id', ParseIntPipe) id: number) {
    return this.comandasService.completeOrder(id);
  }

  @Get()
  findAll(@Query() query: QueryComandaDto) {
    return this.comandasService.findAll(query);
  }

  @Get('/orders')
  findAllOrders(@Query() query: QueryOrderDto) {
    return this.comandasService.findAllOrders(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comandasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComandaDto: UpdateComandaDto) {
    return this.comandasService.update(+id, updateComandaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comandasService.remove(+id);
  }
}
