import { Session } from "@prisma/client";

export class User{
    fullName: string;
    email: string
    signUpDate: Date;
    numberOfLogin: number;
    lastSession: Session;
}