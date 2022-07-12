import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { get } from 'http';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditNameDto, EditPasswordDto } from './dto';
import { SessionDto } from './dto/session.dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

    constructor(private userService: UserService){}

    @Get('profile')
    profile(@GetUser() user: User){
        return user;
    }

    @Patch('name')
    editName(@GetUser('id') userId: string, @Body() dto: EditNameDto){
        return this.userService.editName(userId, dto);
    }

    @Patch('password')
    editPassword(@GetUser('id') userId: string, @Body() dto: EditPasswordDto){
        return this.userService.editPassword(userId, dto);
    }

    @Post('session')
    createSession(@GetUser('id') userId: string, @Body() dto: SessionDto){
        return this.userService.createSession(userId, dto.sessionId);
    }

    @Get('all')
    findUsers(){
        return this.userService.findAllUsers();
    }

    @Get('statistic')
    findStatistic(){
        return this.userService.getStatistic();
    }
}
