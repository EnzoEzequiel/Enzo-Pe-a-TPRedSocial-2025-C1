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
  Req,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateLikeDto } from './dto/create-like.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Roles } from '../auth/roles.decorator';
import * as jwt from 'jsonwebtoken';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

function extractUserFromHeader(authorization: string) {
  if (!authorization) return null;
  const token = authorization.replace('Bearer ', '');
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'jwt') as any;
  } catch {
    return null;
  }
}

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // — Protected: multipart/form-data (createPost) —
  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  async createPost(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
  ) {
    // Manual JWT extraction for multipart endpoint
    const jwtPayload = extractUserFromHeader(req.headers['authorization']);
    if (!jwtPayload || !['admin', 'user'].includes(jwtPayload.role)) {
      throw new ForbiddenException('You do not have permission (roles)');
    }

    if (!createPostDto.content) {
      throw new BadRequestException('El contenido es obligatorio');
    }

    let image: string | undefined;
    if (file) {
      try {
        const upload = await this.cloudinaryService.uploadImageFromBuffer(file);
        image = upload.secure_url;
      } catch {
        throw new InternalServerErrorException('Error al subir la imagen');
      }
    }

    return this.postsService.createPost({
      ...createPostDto,
      username: jwtPayload.username,
      image,
    });
  }

  // — Protected: standard endpoints —
  @Post('like/:postId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  async likePost(
    @Req() req,
    @Param('postId') postId: string,
    @Body() createLikeDto: CreateLikeDto,
  ) {
    // req.user set by AuthMiddleware + JwtAuthGuard
    return this.postsService.likePost(postId, {
      ...createLikeDto,
      username: req.user.username,
    });
  }

  @Post('delete/:postId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  async logicalDeletePost(
    @Param('postId') postId: string,
    @Body('username') username: string,
    @Body('role') role: string,
  ) {
    return this.postsService.logicalDeletePost(postId, username, role);
  }

  @Post(':postId/comment')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  async addComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.postsService.addComment(postId, createCommentDto);
  }

  @Delete(':postId/comments/:commentId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  async deleteComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Query('username') username: string,
    @Query('role') role: string,
  ) {
    return this.postsService.deleteComment(postId, commentId, username, role);
  }

  @Put(':postId/comments/:commentId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  async editComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: { content: string; username: string; role: string },
  ) {
    return this.postsService.editComment(postId, commentId, updateCommentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async softDelete(
    @Param('id') id: string,
    @Query('username') username: string,
    @Query('role') role: string,
  ) {
    return this.postsService.softDeletePost(id, username, role);
  }

  // — Public or unprotected endpoints —
  @Get()
  findAllByUsername(@Query('username') username: string) {
    return this.postsService.findAllByUsername(username);
  }

  @Get('/all')
  findAll() {
    return this.postsService.findAll();
  }

  @Get('order-by-likes')
  getPostsOrderedByLikes() {
    return this.postsService.getPostsOrderedByLikes();
  }

  @Get('paginated')
  getPaginatedPosts(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('order') order: string = 'date',
    @Query('username') username?: string,
  ) {
    return this.postsService.getPaginatedPosts(page, limit, order, username);
  }

  @Delete('like/:postId')
  removeLike(
    @Param('postId') postId: string,
    @Body('username') username: string,
  ) {
    return this.postsService.removeLike(postId, username);
  }
}
