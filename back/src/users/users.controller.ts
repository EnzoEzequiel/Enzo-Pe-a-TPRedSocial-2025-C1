import { Controller, Get, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    findAllByUsername(@Query('username') username: string) {
        return this.usersService.findAllByUsername(username);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Get('friends/:id')
    async getFriends(@Param('id') userId: string) {
    return this.usersService.getFriends(userId);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
