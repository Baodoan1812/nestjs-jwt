
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { comparePassword } from 'helpers/util';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(username);

        const check = await comparePassword(pass, user.password);
        if (!user || !check) {
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
}
