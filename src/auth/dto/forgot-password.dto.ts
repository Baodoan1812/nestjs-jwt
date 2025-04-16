import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgotPasswordDto {
    @IsNotEmpty()
    _id: string;
    @IsNotEmpty()
    codeId: string;
}