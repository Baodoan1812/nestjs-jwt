import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant } from './schemas/restaurant.schema';
@Injectable()
export class RestaurantsService {
  constructor(@InjectModel(Restaurant.name) private RestaurantModel: Model<Restaurant>) { }
  async create(createRestaurantDto: CreateRestaurantDto) {
    return await this.RestaurantModel.create(createRestaurantDto);
  }

  async findAll() {
    const restaurants = await this.RestaurantModel.find({ isDeleted: false });
    return restaurants.map((restaurant) => {
      return {
        id: restaurant._id,
        name: restaurant.name,
        address: restaurant.address,
        phone: restaurant.phone,
        email: restaurant.email,
        isDeleted: restaurant.isDeleted,
      };
    });
  }

  async findOne(id: string) {
    return await this.RestaurantModel.findOne({ _id: id, isDeleted: false });
  }

  async update(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    try {
      await this.RestaurantModel.findOne({ _id: id, isDeleted: false });
      return await this.RestaurantModel.updateOne({ _id: id }, updateRestaurantDto);
    } catch (error) {
      throw new BadRequestException('Error updating restaurant');
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      return await this.RestaurantModel.updateOne({ _id: id }, { isDeleted: true });
    } catch (error) {
      throw new BadRequestException('Error deleting restaurant');
    }
  }
}
