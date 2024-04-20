import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Post,
} from '@nestjs/common';
import { AuthRegisterUserDto } from './dto/authRegisterUser.dto';
import { AuthService } from './auth.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly notificationService: NotificationsService,
  ) {}

  @Post('register')
  async register(@Body() authRegisterUserDto: AuthRegisterUserDto) {
    const userExists = await this.authService.getUserByEmail(
      authRegisterUserDto.email,
    );

    if (userExists) {
      throw new HttpException('User already exists', 200);
    }

    const user = await this.authService.register(authRegisterUserDto);

    if (!user) {
      throw new HttpException('User not created', 500);
    }

    const code = await this.authService.generateVerificationCode(user.id);

    if (!code) {
      throw new HttpException('Code not generated', 500);
    }

    if (this.authService.isActiveSmsNotification) {
      await this.notificationService.sendSMS({
        phone: authRegisterUserDto.phone,
        message: `Welcome to our platform!. Your verification code is ${code}`,
      });
    }

    return {
      message: 'User created successfully',
      data: user,
    };
  }

  @Post('verify-code')
  @HttpCode(200)
  async verifyCode(@Body() body: { code: string; id: string }) {
    const result = await this.authService.verifyCode(body.id, body.code);

    if (!result) {
      throw new HttpException('Code not valid', 200);
    }

    const user = await this.authService.getUserById(body.id);

    this.notificationService.sendSimpleMail(
      user.email,
      'Welcome!',
      `Hi ${user.name}, Welcome to our platform!`,
    );

    return {
      message: 'Code verified successfully',
    };
  }
}
