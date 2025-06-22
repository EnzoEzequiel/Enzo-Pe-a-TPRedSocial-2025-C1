export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    birthDate: string;
    description?: string;
    profileImage?: string;
    isAdmin: string;
    accessToken: string;
    createdAt: Date | string;
    show: boolean;
}
