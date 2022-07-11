import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditNameDto, EditPasswordDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService) { }

    async editName(userId: string, dto: EditNameDto) {
        const user = await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                ...dto
            }
        });
        delete user.hash
        return user;
    }

    async editPassword(userId: string, dto: EditPasswordDto) {
        //find user by id
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            }
        });

        //compare password
        const pwdMatches = await argon.verify(user.hash, dto.oldPassword);
        //if password incorrect throw excption
        if (!pwdMatches) throw new HttpException({
            statusCode: HttpStatus.BAD_REQUEST,
            message:['Invalid Current Password'],
            error: "Bad Request"
        }, HttpStatus.BAD_REQUEST);

        //generate the password
        const hash = await argon.hash(dto.newPassword);
        //update password
        const updatedUser = await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                hash: hash
            }
        });
        delete updatedUser.hash;
        return updatedUser;
    }

}
