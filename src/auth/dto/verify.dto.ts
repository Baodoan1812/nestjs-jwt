import { IsEmail, IsNotEmpty } from "class-validator";

export class VerifyDto {
    @IsNotEmpty()
    _id: string;
    @IsNotEmpty()
    codeId: string;
}