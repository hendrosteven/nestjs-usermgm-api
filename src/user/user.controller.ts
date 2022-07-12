import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditNameDto, EditPasswordDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

    constructor(private userService: UserService){}

    @Get('profile')
    profile(@GetUser() user: User){
        console.log(user);
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
}
