import { Body, Controller, Post } from '@nestjs/common';
import { AuthRegisterUserDto } from './dto/register.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly autService: AuthService) {}

  @Post('register')
  async register(@Body() authRegisterUserDto: AuthRegisterUserDto) {
    return await this.autService.register(authRegisterUserDto);
  }
}
