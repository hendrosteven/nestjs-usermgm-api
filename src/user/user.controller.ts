import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditNameDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

    constructor(private userService: UserService){}

    @Get('profile')
    profile(@GetUser() user: User){
        return user;
    }

    @Patch()
    editName(@GetUser('id') userId: string, @Body() dto: EditNameDto){
        return this.userService.editName(userId, dto);
    }
}
