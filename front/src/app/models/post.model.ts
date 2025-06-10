export interface Comment {
    username: string;
    firstName: string;
    lastName: string;
    profileImage: string;
    content: string;
}

export interface Like {
    username: string;
    firstName: string;
    lastName: string;
    profileImage: string;
}

export interface Post {
    firstName: string;
    lastName: string;
    profileImage: string;
    username: string;
    content: string;
    image?: string;
    likes: Like[];
    comments: Comment[];
    date: string;
    show: boolean;
}
