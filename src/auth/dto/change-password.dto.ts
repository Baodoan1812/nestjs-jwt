import { IsEmail, IsNotEmpty } from "class-validator";

export class ChangePasswordDto {
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    codeId: string;
    @IsNotEmpty()
    password: string;
    @IsNotEmpty()
    confirmPassword: string;
}