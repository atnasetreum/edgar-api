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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, QueryUserDto, UpdateUserDto } from './dto';
import { JwtValidateGuard } from 'src/auth/guards';
import { AuditsService } from 'src/audits/audits.service';
import { User } from 'src/auth/decorators/user.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly auditsService: AuditsService,
  ) {}

  @Post()
  @UseGuards(JwtValidateGuard)
  create(@Body() createUserDto: CreateUserDto, @User() userId: number) {
    return this.usersService.create(createUserDto).then(async (user) => {
      const userCurrent = await this.usersService.findOne(userId);
      this.auditsService.create({
        methodName: 'CREATE',
        user: userCurrent,
        data: {
          message: `Creo el usuario con el id: ${user.id} ref: ${user.name} - ${user.userType.name}`,
        },
      });
      return user;
    });
  }

  @Get()
  @UseGuards(JwtValidateGuard)
  findAll(@Query() query: QueryUserDto) {
    return this.usersService.findAll(query);
  }

  @Get('users-login')
  usersLogin() {
    return this.usersService.usersLogin();
  }

  @Get(':id')
  @UseGuards(JwtValidateGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtValidateGuard)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() userId: number,
  ) {
    return this.usersService.update(+id, updateUserDto).then(async (user) => {
      const userCurrent = await this.usersService.findOne(userId);
      this.auditsService.create({
        methodName: 'UPDATE',
        user: userCurrent,
        data: {
          message: `Actualizo el usuario con el id: ${id} ref: ${user.name} - ${user.userType.name}`,
        },
      });
      return user;
    });
  }

  @Delete(':id')
  @UseGuards(JwtValidateGuard)
  remove(@Param('id') id: string, @User() userId: number) {
    return this.usersService.remove(+id).then(async (user) => {
      const userCurrent = await this.usersService.findOne(userId);
      this.auditsService.create({
        methodName: 'DELETE',
        user: userCurrent,
        data: {
          message: `Elimino el usuario con el id: ${id} ref: ${user.name} - ${user.userType.name}`,
        },
      });
      return user;
    });
  }
}
