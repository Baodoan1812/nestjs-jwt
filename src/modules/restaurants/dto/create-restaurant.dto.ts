import { IsNotEmpty } from "class-validator";

export class CreateRestaurantDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    phone: string;

    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    rating: number;
}
