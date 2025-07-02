import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { PostsModule } from '../posts/posts.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
PostsModule, CloudinaryModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }
