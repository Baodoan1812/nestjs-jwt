import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { hashPassword } from 'helpers/util';
import aqp from 'api-query-params';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
import { VerifyDto } from '@/auth/dto/verify.dto';
import { ResendCodeIdDto } from '@/auth/dto/resend-codeId.dto';
import { ForgotPasswordDto } from '@/auth/dto/forgot-password.dto';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>,
    private readonly mailerService: MailerService) { }
  isExistEmail = async (email: string) => {
    const userExist = await this.userModel.exists({ email });
    if (userExist) return true;
    else return false;
  }
  async create(createUserDto: CreateUserDto) {

    const { name, email, password, phone, address, image } = createUserDto;
    //check email exist
    const check = await this.isExistEmail(email);
    if (check) {
      throw new BadRequestException("Email đã tồn tại. Vui lòng sử dụng email khác!")
    }
    //hash password
    const hashedPassword = hashPassword(password);
    // create user
    const user = await this.userModel.create({
      name, email, password: hashedPassword, phone, address, image
    })
    return { _id: user._id }
  }
  async createUserClient(createUserDto: CreateUserDto) {

    const { name, email, password, phone, address, image } = createUserDto;
    //check email exist
    const check = await this.isExistEmail(email);
    if (check) {
      throw new BadRequestException("Email đã tồn tại. Vui lòng sử dụng email khác!")
    }
    //hash password
    const hashedPassword = hashPassword(password);
    // create user
    const codeId = uuidv4();
    const user = await this.userModel.create({
      name, email, password: hashedPassword, phone, address, image,
      isActive: false,
      codeId: codeId,
      codeExpired: dayjs().add(30, 'seconds')
    })
    this.mailerService
      .sendMail({
        to: user.email, // list of receivers
        from: 'noreply@nestjs.com', // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        context: {
          name: user.name,
          activationCode: codeId
        },
        template: 'register'
      })
    return { _id: user._id }
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;
    if (!current) {
      current = 1;
    }
    if (!pageSize) {
      pageSize = 10;
    }
    const totalUsers = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalUsers / pageSize);
    if (current > totalPages) {
      current = 1;
    }
    const skipNumber = (current - 1) * pageSize;

    const results = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(skipNumber)
      .select("-password")
    return {
      meta: {
        current: current, //trang hiện tại
        pageSize: pageSize, //số lượng bản ghi đã lấy
        pages: totalPages,  //tổng số trang với điều kiện query
        total: totalUsers // tổng số phần tử (số bản ghi)
      },
      results //

    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }
  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto });
  }

  async remove(id: string) {
    return await this.userModel.deleteOne({ _id: id });

  }

  async verifyUser(verifyDto: VerifyDto) {
    const user = await this.userModel.findOne({ _id: verifyDto._id });
    const checkExpireCodeId = dayjs().isBefore(user.codeExpired);
    if (!checkExpireCodeId) {
      throw new BadRequestException();
    }
    const check = (verifyDto.codeId === user.codeId);

    if (check) {
      return this.userModel.updateOne({ _id: verifyDto._id }, { isActive: true })

    }
    else {
      throw new BadRequestException();
    }

  }
  async resendCodeIdUser(resendCodeId: ResendCodeIdDto) {
    const codeId = uuidv4();
    const user = await this.userModel.findOne({
      _id: resendCodeId._id
    })
    if (!user) {
      throw new BadRequestException();
    }
    await this.userModel.updateOne({ _id: resendCodeId._id }, {
      codeId: codeId,
      codeExpired: dayjs().add(30, 'seconds')
    })
    this.mailerService
      .sendMail({
        to: user.email, // list of receivers
        from: 'noreply@nestjs.com', // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        context: {
          name: user.name,
          activationCode: codeId
        },
        template: 'register'
      })
    return { _id: user._id }
  }

}
