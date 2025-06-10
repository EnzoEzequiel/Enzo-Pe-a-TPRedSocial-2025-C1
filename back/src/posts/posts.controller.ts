import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    Body,
    BadRequestException,
    InternalServerErrorException,
    Query,
    Param,
    Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateLikeDto } from './dto/create-like.dto';

@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    @Post('create')
    @UseInterceptors(FileInterceptor('image'))
    async createPost(
        @UploadedFile() file: Express.Multer.File,
        @Body() createPostDto: CreatePostDto,
    ) {
        try {
            let image: string | undefined;

            // Validación simple de campos obligatorios
            if (!createPostDto.username || !createPostDto.content) {
                throw new BadRequestException('El nombre de usuario y el contenido son obligatorios');
            }

            // Subida a Cloudinary (si hay archivo)
            if (file) {
                try {
                    const imageUploadResult = await this.cloudinaryService.uploadImageFromBuffer(file);
                    image = imageUploadResult.secure_url;
                } catch (err) {
                    console.error('Error subiendo imagen a Cloudinary:', err);
                    throw new InternalServerErrorException('Error al subir la imagen');
                }
            }
            // Crear post en la base de datos
            const newPost = await this.postsService.createPost({
                ...createPostDto,
                image,
            });

            return newPost;

        } catch (error) {
            console.error('Error en el controlador createPost:', error);
            // Rethrow si ya es una excepción conocida de NestJS
            if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
                throw error;
            }
            throw new InternalServerErrorException('Error interno al crear el post');
        }
    }

    @Get()
    findAllByUsername(@Query('username') username: string) {
        return this.postsService.findAllByUsername(username);
    }

    @Get('/all')
    findAll() {
        return this.postsService.findAll();
    }

    @Post('like/:postId')
    async likePost(
        @Param('postId') postId: string,
        @Body() createLikeDto: CreateLikeDto
    ) {
        return this.postsService.likePost(postId, createLikeDto);
    }

}
