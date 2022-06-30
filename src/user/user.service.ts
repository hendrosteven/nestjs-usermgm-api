import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditNameDto } from './dto';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService){}

    async editName(userId: string, dto: EditNameDto){
        const user = await this.prisma.user.update({
            where:{
                id: userId
            },
            data:{
                ...dto
            }        
        });
        delete user.hash
        return user;
    }

}
