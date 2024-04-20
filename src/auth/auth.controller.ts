import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { AuthRegisterUserDto } from './dto/authRegisterUser.dto';
import { AuthService } from './auth.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly autService: AuthService,
    private readonly notificationService: NotificationsService,
  ) {}

  @Post('register')
  async register(@Body() authRegisterUserDto: AuthRegisterUserDto) {
    const userExists = await this.autService.getUserByEmail(
      authRegisterUserDto.email,
    );

    if (userExists) {
      throw new HttpException('User already exists', 200);
    }

    const user = await this.autService.register(authRegisterUserDto);

    if (!user) {
      throw new HttpException('User not created', 500);
    }

    const code = await this.autService.generateVerificationCode(user.id);

    await this.notificationService.sendSMS({
      phone: authRegisterUserDto.phone,
      message: `Welcome to our platform!. Your verification code is ${code}`,
    });

    return {
      message: 'User created successfully',
      data: user,
    };
  }
}
