import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('User') private userModel: Model<CreateUserDto>,
        private jwtService: JwtService
    ) { }

    async create(userData: CreateUserDto): Promise<CreateUserDto> {
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltOrRounds);

        const newUser = new this.userModel({
            ...userData,
            show: true,
            password: hashedPassword
        });

        return newUser.save();
    }

    async login(usernameOrEmail: string, password: string): Promise<{ accessToken: string; user: any } | null> {
        const user = await this.userModel.findOne({
            $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }]
        }).exec();

        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return null;

        const payload = {
            sub: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        };

        const accessToken = this.jwtService.sign(payload);

        return {
            accessToken,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                birthDate: user.birthDate,
                description: user.description || "",
                profileImage: user.profileImage || "",
                createdAt: user.createdAt,
                show: user.show
            }
        };
    }

    async findAll(): Promise<CreateUserDto[]> {
        return this.userModel.find().exec();
    }

    async findOneByEmail(email: string): Promise<CreateUserDto | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async findOneByUsername(username: string): Promise<CreateUserDto | null> {
        return this.userModel.findOne({ username }).exec();
    }
    generateToken(user: any): string {
        const payload = {
            sub: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        };
        return this.jwtService.sign(payload);
    }
}

