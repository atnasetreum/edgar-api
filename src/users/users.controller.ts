import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { JwtValidateGuard } from 'src/auth/guards';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtValidateGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtValidateGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('users-login')
  usersLogin() {
    return this.usersService.usersLogin();
  }

  @Get('drivers')
  usersDrivers() {
    return this.usersService.usersDrivers();
  }

  @Get(':id')
  @UseGuards(JwtValidateGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtValidateGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtValidateGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
