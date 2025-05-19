
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from '@nestjs/common';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { Public } from '@/decorator/customize';
import { CreateUserDto } from './dto/create-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from '@/modules/users/users.service';
import { VerifyDto } from './dto/verify.dto';
import { ResendCodeIdDto } from './dto/resend-codeId.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,
        private readonly mailerService: MailerService,
        private usersService: UsersService,
    ) { }
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }
    @Public()
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto)
    }
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
    @Public()
    @Post('verify')
    async verify(@Body() verifyDto: VerifyDto) {
        return this.authService.verify(verifyDto)
    }
    @Public()
    @Post('resend-codeId')
    async resend(@Body() resendCodeIdDto: ResendCodeIdDto) {
        return this.authService.resend(resendCodeIdDto)
    }
    @Public()
    @Post('forgot-password')
    async forgotPassword(@Body("email") email: string) {
        return this.authService.forgotPassword(email)
    }
    @Public()
    @Post('change-password')
    async changePassword(@Body() changePassword: ChangePasswordDto) {
        return this.authService.changePassword(changePassword)
    }
}
