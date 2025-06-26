import { Controller, Get, Param, Delete, Query, Body, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @Roles('admin')
    findAll() {
        return this.usersService.findAll();
    }

    @Get('username')
    @Roles('admin', 'user')
    findAllByUsername(@Query('username') username: string) {
        return this.usersService.findAllByUsername(username);
    }

    @Get(':id')
    @Roles('admin', 'user')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Get('friends/:id')
    @Roles('admin', 'user')
    async getFriends(@Param('id') userId: string) {
        return this.usersService.getFriends(userId);
    }

    @Post()
    @Roles('admin')
    create(@Body() createUserDto: any) {
        return this.usersService.create(createUserDto);
    }

    @Delete(':id')
    @Roles('admin')
    disable(@Param('id') id: string) {
        return this.usersService.disable(id);
    }

    @Post(':id/enable')
    @Roles('admin')
    enable(@Param('id') id: string) {
        return this.usersService.enable(id);
    }
}
