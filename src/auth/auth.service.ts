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

  async generateVerificationCode(userId: string): Promise<string | null> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const result = await this.db.userVerificationCodes.create({
      data: {
        code,
        userId,
      },
    });

    if (!result) {
      return null;
    }

    return code;
  }

  isActiveSmsNotification(): boolean {
    return process.env.SMS_NOTIFICATIONS_ENABLED == 'true';
  }

  async verifyCode(userId: string, code: string): Promise<boolean> {
    let isValid = true;
    const userCode = await this.db.userVerificationCodes.findFirst({
      where: {
        userId,
        code,
      },
    });

    if (!userCode) {
      return false;
    }

    if (process.env.VERIFICATION_CODE_ENABLED == 'false') {
      const createdAt = new Date(userCode.createdAt);
      let minutes =
        parseInt(process.env.VERIFICATION_CODE_EXPIRATION_MINUTES) || 15;

      if (isNaN(minutes)) {
        minutes = 15;
      }

      createdAt.setMinutes(createdAt.getMinutes() + minutes);

      if (createdAt < new Date()) {
        isValid = false;
      }
    }

    await this.db.userVerificationCodes.delete({
      where: {
        id: userCode.id,
      },
    });

    await this.db.user.update({
      where: {
        id: userId,
      },
      data: {
        verified: true,
        verifiedAt: new Date(),
        active: true,
      },
    });

    isValid = true;

    return isValid;
  }
}
