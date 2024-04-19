import { Injectable } from '@nestjs/common';
import { AuthRegisterUserDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor() {}

  async register(authRegisterUserDto: AuthRegisterUserDto): Promise<any> {

    // Remove password and confirm_password from the response
    authRegisterUserDto.confirm_password &&
      delete authRegisterUserDto.confirm_password;
    authRegisterUserDto.password && delete authRegisterUserDto.password;

    return {
      message: 'User registered successfully',
      data: authRegisterUserDto,
    };
  }
}
