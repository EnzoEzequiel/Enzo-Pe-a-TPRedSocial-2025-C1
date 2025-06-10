import {
    IsString,
    IsEmail,
    MinLength,
    MaxLength,
    Matches,
    IsDateString,
    IsOptional,
    IsBoolean
} from 'class-validator';

export class CreateUserDto {
    @IsString()
    @MinLength(3)
    @MaxLength(15)
    firstName: string;

    @IsString()
    @MinLength(3)
    @MaxLength(15)
    lastName: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(3)
    @MaxLength(15)
    username: string;

    @IsString()
    @MinLength(8)
    @MaxLength(15)
    @Matches(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,15}$/)
    password: string;

    @IsDateString()
    birthDate: string;

    @IsOptional()
    @IsString()
    @MaxLength(250)
    description?: string;

    @IsOptional()
    @IsString()
    profileImage?: string;

    @IsString()
    isAdmin: string;

    @IsDateString()
    createdAt: Date | string;

    @IsBoolean()
    show: boolean;


}
