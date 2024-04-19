import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [AuthModule, NotificationsModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
