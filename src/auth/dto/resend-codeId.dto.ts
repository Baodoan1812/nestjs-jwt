import { IsEmail, IsNotEmpty } from "class-validator";

export class ResendCodeIdDto {
    @IsNotEmpty()
    _id: string;
}


