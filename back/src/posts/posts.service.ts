import { Injectable, InternalServerErrorException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { CreateLikeDto } from './dto/create-like.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Model } from 'mongoose';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel('Post') private postModel: Model<Post>,
    ) { }

    async createPost(data: {
        firstName: string;
        lastName: string;
        profileImage: string;
        username: string;
        content: string;
        image?: string;
    }) {
        try {
            if (!data.username || !data.content) {
                throw new BadRequestException('El nombre de usuario y el contenido son obligatorios');
            }

            const newPost = new this.postModel({
                firstName: data.firstName,
                lastName: data.lastName,
                profileImage: data.profileImage,
                username: data.username,
                content: data.content,
                image: data.image,
                likes: [],
                comments: [],
                date: new Date(),
                show: true,
            });

            return await newPost.save();
        } catch (error) {
            console.error('Error al crear el post:', error);

            // Puedes personalizar más los errores si lo deseas
            throw new InternalServerErrorException('No se pudo crear el post');
        }
    }

    async findAllByUsername(username: string): Promise<Post[]> {
        try {
            const posts = await this.postModel
                .find({ username: username })
                .sort({ date: -1 }) // Ordena por fecha descendente
                .exec();
            return posts;
        } catch (error) {
            console.error('Error al obtener todos los posts:', error);
            throw new InternalServerErrorException('Error al obtener todos los posts');
        }
    }

    async findAll(): Promise<Post[]> {
        try {
            const posts = await this.postModel
                .find()
                .sort({ date: -1 })
                .exec();

            return posts;
        } catch (error) {
            console.error('Error al obtener todos los posts:', error);
            throw new InternalServerErrorException('Error al obtener todos los posts');
        }
    }

    async likePost(postId: string, likeData: CreateLikeDto) {
        try {
            const post = await this.postModel.findById(postId);

            if (!post) {
                throw new BadRequestException('No se encontró el post');
            }

            // Evitar duplicados
            if (post.likes.some(like => like.username === likeData.username)) {
                post.likes = post.likes.filter(like => like.username !== likeData.username);
                await post.save();
                return post;
            }

            post.likes.push(likeData);
            await post.save();

            return post;
        } catch (error) {
            console.error('Error al hacer like:', error);
            throw new InternalServerErrorException('Error al hacer like');
        }
    }

    async logicalDeletePost(postId: string, username: string, role: string) {
        try {
            const post = await this.postModel.findById(postId);
            if (!post) {
                throw new BadRequestException('No se encontró el post');
            }
            if (role !== 'admin' && post.username !== username) {
                throw new ForbiddenException('No tienes permiso para eliminar este post');
            }
            post.show = false;
            await post.save();
            return { message: 'Post eliminado lógicamente', post };
        } catch {
            throw new InternalServerErrorException('Error al eliminar el post');
        }
    }

    async getPostsOrderedByLikes(): Promise<Post[]> {
        try {
            const posts = await this.postModel.find({ show: true }).lean();
            return posts.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
        } catch {
            throw new InternalServerErrorException('Error al ordenar los posts por likes');
        }
    }

    async getComments(postId: string, page = 1, limit = 10) {
        const post = await this.postModel.findById(postId);
        if (!post) throw new BadRequestException('No se encontró el post');
        const start = (page - 1) * limit;
        const end = start + limit;
        const total = post.comments.length;
        const comments = post.comments.slice(start, end);
        return { comments, total };
    }

    // async editComment(postId: string, commentId: string, updateCommentDto: UpdateCommentDto, username: string, role: string) {
    //     const post = await this.postModel.findById(postId);
    //     if (!post) throw new NotFoundException('Post not found');
    //     const comment = post.comments.id(commentId);
    //     if (!comment) throw new NotFoundException('Comment not found');
    //     if (role !== 'admin' && comment.username !== username) throw new ForbiddenException('No permission');
    //     comment.content = updateCommentDto.content;
    //     comment.modified = true;
    //     await post.save();
    //     return comment;
    // }
    async addComment(postId: string, commentData: CreateCommentDto) {
        const post = await this.postModel.findById(postId);
        if (!post) throw new BadRequestException('No se encontró el post');
        post.comments.unshift({
            ...commentData,
            date: new Date(),
            modified: false
        });
        await post.save();
        return post.comments[0];
    }

}
