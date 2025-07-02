import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { CloudinaryService } from '../cloudinary/cloudinary.service'; // Adjust the path as needed
import { Post, PostDocument } from '../posts/schemas/post.schema'; // Adjust the path as needed
@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const saltOrRounds = 10;
        createUserDto.password = await bcrypt.hash(createUserDto.password, saltOrRounds);
        
        if (!createUserDto.role) {
            createUserDto.role = 'user';
        }
        
        const newUser = new this.userModel(createUserDto);
        return newUser.save();
    }

    async findAllByUsername(username: string): Promise<User[]> {
        return this.userModel
            .find({ username: { $ne: username.trim() } })
            .select('username firstName lastName profileImage')
            .limit(3)
            .exec();
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userModel.findById(id).exec();
        if (!user) throw new NotFoundException('Usuario no encontrado');
        return user;
    }

    async remove(id: string): Promise<void> {
        const result = await this.userModel.findByIdAndDelete(id).exec();
        if (!result) throw new NotFoundException('Usuario no encontrado para eliminar');
    }

    async getFriends(userId: string): Promise<User[]> {
        const user = await this.userModel.findById(userId).populate('friends', '-password').exec();
        if (!user) throw new NotFoundException('Usuario no encontrado');
        return user.friends;
    }

    async disable(id: string): Promise<void> {
        const user = await this.userModel.findById(id).exec();
        if (!user) throw new NotFoundException('Usuario no encontrado para deshabilitar');
        user.show = false;
        await user.save();
    }

    async enable(id: string): Promise<void> {
        const user = await this.userModel.findById(id).exec();
        if (!user) throw new NotFoundException('Usuario no encontrado para habilitar');
        user.show = true;
        await user.save();
    }

    // async updateUser(id: string, updateUserDto: Partial<CreateUserDto>, file?: Express.Multer.File): Promise<User> {
    //     const user = await this.userModel.findById(id).exec();
    //     if (!user) throw new NotFoundException('Usuario no encontrado');
    //     if (file) {
    //         // updateUserDto.profileImage = file.path;
    //         const upload = await this.cloudinaryService.uploadImageFromBuffer(file);
    //         user.profileImage = upload.secure_url;
    //     }
    //     if (updateUserDto.password) {
    //         const saltOrRounds = 10;
    //         updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltOrRounds);
    //     }
    //     Object.assign(user, updateUserDto);
    //     return user.save();
    // }
    async updateUser(
        id: string,
        updateUserDto: Partial<CreateUserDto>,
        file?: Express.Multer.File
    ): Promise<User> {
        const user = await this.userModel.findById(id).exec();
        if (!user) throw new NotFoundException('Usuario no encontrado');

        if (file) {
            const upload = await this.cloudinaryService.uploadImageFromBuffer(file);
            user.profileImage = upload.secure_url;
        }

        if (updateUserDto.password) {
            const saltOrRounds = 10;
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltOrRounds);
        }

        Object.assign(user, updateUserDto);

        const updatedUser = await user.save();

        await this.postModel.updateMany(
            { username: updatedUser.username },
            { $set: { profileImage: updatedUser.profileImage } }
        );

        return updatedUser;
    }

}
