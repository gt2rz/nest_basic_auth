import {
  Body,
  Controller,
  HttpException,
  Post,
} from '@nestjs/common';
import { AuthRegisterUserDto } from './dto/authRegisterUser.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly autService: AuthService) {}

  @Post('register')
  async register(@Body() authRegisterUserDto: AuthRegisterUserDto) {
    const userExists = await this.autService.getUserByEmail(
      authRegisterUserDto.email,
    );

    if (userExists) {
      throw new HttpException('User already exists', 200);
    }

    const user = await this.autService.register(authRegisterUserDto);
    return {
      message: 'User created successfully',
      data: user,
    };
  }
}
