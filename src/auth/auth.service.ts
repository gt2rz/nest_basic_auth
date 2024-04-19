import { Injectable } from '@nestjs/common';
import { AuthRegisterUserDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor() {}

  async register(authRegisterUserDto: AuthRegisterUserDto): Promise<any> {
    return {
      message: 'User registered successfully',
      data: authRegisterUserDto,
    };
  }
}
