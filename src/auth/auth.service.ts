import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor() {}

  async register(registerDto: RegisterDto): Promise<any> {
    return {
      message: 'User registered successfully',
      data: registerDto,
    };
  }
}
