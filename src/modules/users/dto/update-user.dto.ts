import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";


export class UpdateUserDto {
    @IsMongoId()
    _id: string;
    @IsOptional()
    name: string;
    @IsOptional()
    phone: string;
    @IsOptional()
    address: string;
    @IsOptional()
    image: string;
}
