import { Injectable } from '@nestjs/common';
import { AuthRegisterUserDto } from './dto/authRegisterUser.dto';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly db: PrismaService) {}

  async getUserByEmail(email: string): Promise<User> {
    return this.db.user.findUnique({
      where: {
        email,
      },
    });
  }

  async register(authRegisterUserDto: AuthRegisterUserDto): Promise<any> {
    
    const user = await this.db.user.create({
      data: {
        email: authRegisterUserDto.email,
        password: authRegisterUserDto.password,
        name: authRegisterUserDto.name,
        lastname: authRegisterUserDto.lastname,
        phone: authRegisterUserDto.phone,
      },
    });

    const excludedFields = [
      'password',
      'active',
      'verified',
      'verifiedAt',
      'updatedAt',
    ];

    for (const field of excludedFields) {
      delete user[field];
    }

    return user;
  }
}
