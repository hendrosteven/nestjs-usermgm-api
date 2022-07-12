import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditNameDto, EditPasswordDto } from './dto';
import * as argon from 'argon2';
import { User } from './dto/user.dto';
import { networkInterfaces } from 'os';
import { Statistic } from './dto/statistic.dto';

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

    async createSession(_userId: string, _sessionId: string){
         //save session
         try {
            const session = await this.prisma.session.create({
                data: {
                    sessionId: _sessionId,
                    userId: _userId
                }
            });           
        } catch (error) {
            throw error;
        }
    
    }

    async findAllUsers(){
        const users = await this.prisma.user.findMany({
            include:{
                sessions:{
                    orderBy:{
                        createdAt: 'desc'
                    }
                }
            }
        });
        const userList : User[] = [];
        users.forEach((user) =>{
            const temp: User = new User();
            temp.fullName= user.fullName;
            temp.email = user.email;
            temp.signUpDate = user.createdAt;
            temp.numberOfLogin = user.numberOfLogin;
            temp.lastSession = user.sessions.length>0 ? user.sessions[0] : null;
            userList.push(temp);
        });
        return userList;
    }

    async countTotalUser(){
        const totalUser = await this.prisma.user.aggregate({
            _count:{
                id: true
            }
        })
        return totalUser._count.id;
    }

    async countSessionToday(){
        const end = new Date(Date.now());
        const begin = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) 
        const sessionToday = await this.prisma.session.aggregate({
            _count:{
                id: true
            },
            where: {
                createdAt: {
                    gte: begin,
                    lt: end
                },

            }
        })
        return sessionToday._count.id
    }

    async countSessionThisWeek(){
        const sevenDaysAgo: Date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)  
        const sessionThisWeek = await this.prisma.session.aggregate({
            _count:{
                id: true
            },
            where: {
                createdAt: {
                    gte: sevenDaysAgo
                }
            }
        })
        return sessionThisWeek._count.id;
    }

    async getStatistic(){
        const statistic: Statistic = new Statistic();
        statistic.totalUsers = await this.countTotalUser();
        statistic.totalSessionToday = await this.countSessionToday();
        statistic.totalSessionThisWeek = await this.countSessionThisWeek()/7;
        return statistic;
    }

}
