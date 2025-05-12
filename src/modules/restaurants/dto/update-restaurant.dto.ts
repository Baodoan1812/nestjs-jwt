import { IsOptional } from 'class-validator';
export class UpdateRestaurantDto {
    @IsOptional()
    name: string
    @IsOptional()
    rating: number
    @IsOptional()
    phone: string
    @IsOptional()
    address: string
}
