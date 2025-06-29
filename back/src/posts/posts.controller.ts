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
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateLikeDto } from './dto/create-like.dto';
// import { UpdateCommentDto } from './dto/update-comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('posts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {
    console.log('[PostsController] Inicializado');
  }

  @Post('create')
  @Roles('admin', 'user')
  @UseInterceptors(FileInterceptor('image'))
  async createPost(
    @UploadedFile() file: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
  ) {
    try {
      let image: string | undefined;

      if (!createPostDto.username || !createPostDto.content) {
        throw new BadRequestException(
          'El nombre de usuario y el contenido son obligatorios',
        );
      }

      if (file) {
        try {
          const upload = await this.cloudinaryService.uploadImageFromBuffer(file);
          image = upload.secure_url;
        } catch (err) {
          console.error('Error subiendo imagen a Cloudinary:', err);
          throw new InternalServerErrorException('Error al subir la imagen');
        }
      }

      const newPost = await this.postsService.createPost({
        ...createPostDto,
        image,
      });

      return newPost;
    } catch (error) {
      console.error('Error en el controlador createPost:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
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
  // @Get('/all')
  // findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
  //   return this.postsService.findAllPaginated(page, limit);
  // }

  @Post('like/:postId')
  @Roles('admin', 'user')
  async likePost(
    @Param('postId') postId: string,
    @Body() createLikeDto: CreateLikeDto,
  ) {
    return this.postsService.likePost(postId, createLikeDto);
  }

  @Post('delete/:postId')
  @Roles('admin', 'user')
  async logicalDeletePost(
    @Param('postId') postId: string,
    @Body('username') username: string,
    @Body('role') role: string,
  ) {
    return this.postsService.logicalDeletePost(postId, username, role);
  }

  @Get('order-by-likes')
  async getPostsOrderedByLikes() {
    return this.postsService.getPostsOrderedByLikes();
  }

  @Post(':postId/comment')
  @Roles('admin', 'user')
  async addComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto
  ) {
    return this.postsService.addComment(postId, createCommentDto);
  }
  
  @Get(':postId/comments')
  async getComments(
    @Param('postId') postId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ) {
    return this.postsService.getComments(postId, Number(page), Number(limit));
  }

  @Delete(':postId/comments/:commentId')
  @Roles('admin', 'user')
  async deleteComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Query('username') username: string,
    @Query('role') role: string,
  ) {
    return this.postsService.deleteComment(postId, commentId, username, role);
  }

  @Delete(':id')
  @Roles('admin')
  async softDelete(
    @Param('id') id: string,
    @Query('username') username: string,
    @Query('role') role: string
  ) {
    return this.postsService.softDeletePost(id, username, role);
  }
  @Get('paginated')
  async getPaginatedPosts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('order') order: string = 'date',
    @Query('username') username?: string
  ) {
    console.log('[PostsController] getPaginatedPosts llamada con:', { page, limit, order, username });
    return this.postsService.getPaginatedPosts(page, limit, order, username);
  }

  @Delete('like/:postId')
  async removeLike(
    @Param('postId') postId: string,
    @Body('username') username: string
  ) {
    return this.postsService.removeLike(postId, username);
  }

  @Put(':postId/comments/:commentId')
  @Roles('admin', 'user')
  async editComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: { content: string, username: string, role: string }
  ) {
    return this.postsService.editComment(postId, commentId, updateCommentDto);
  }
}
