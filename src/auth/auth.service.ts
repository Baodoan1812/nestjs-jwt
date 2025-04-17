
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { comparePassword } from 'helpers/util';
import { JwtService } from '@nestjs/jwt';
import { VerifyDto } from './dto/verify.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ResendCodeIdDto } from './dto/resend-codeId.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(username);
        if (!user) {
            return null;
        }
        if (user.isActive === false) {
            return null;
        }
        const check = await comparePassword(pass, user.password);
        if (!check) {
            return null;
        }

        return user;


    }
    async login(user: any) {
        const payload = { username: user.email, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async register(createUserDto: CreateUserDto) {
        return this.usersService.createUserClient(createUserDto);
    }

    async verify(verifyDto: VerifyDto) {
        return this.usersService.verifyUser(verifyDto);
    }
    async resend(resendCodeId: ResendCodeIdDto) {
        return this.usersService.resendCodeIdUser(resendCodeId);
    }
    async forgotPassword(email: string) {
        return this.usersService.forgotPassword(email);
    }
    async changePassword(data: ChangePasswordDto) {
        return this.usersService.changePassword(data);
    }

}
