// src/posts/dto/create-post.dto.ts
export class CreatePostDto {
    firstName: string;
    lastName: string;
    profileImage: string;
    username: string;
    content: string;
    image?: string;
    date?: Date | string;

}
