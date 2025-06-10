import {
    Body,
    Controller,
    Get,
    Post,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateUserDto } from './dto/create-user.dto';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly cloudinaryService: CloudinaryService,
    ) { }
    @Post('register')
    @UseInterceptors(FileInterceptor('profileImage'))
    async register(
        @Body() createUserDto: CreateUserDto,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<CreateUserDto> {
        const existingEmail = await this.authService.findOneByEmail(createUserDto.email);
        const existingUsername = await this.authService.findOneByUsername(createUserDto.username);

        if (existingEmail) {
            throw new BadRequestException('El email ya está registrado');
        }

        if (existingUsername) {
            throw new BadRequestException('El nombre de usuario ya está registrado');
        }

        if (file) {
            const imageUploadResult = await this.cloudinaryService.uploadImageFromBuffer(file);
            createUserDto.profileImage = imageUploadResult.secure_url;
        }

        const user = await this.authService.create(createUserDto);
        return user;
    }

    @Post('login')
    async login(
        @Body() body: { usernameOrEmail: string; password: string }
    ): Promise<{ accessToken: string }> {
        const result = await this.authService.login(body.usernameOrEmail, body.password);

        if (!result) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        return result;
    }


    @Get()
    async list(): Promise<CreateUserDto[]> {
        return this.authService.findAll();
    }
}
