import { Module } from '@nestjs/common';
import { TwilioModule } from 'nestjs-twilio';
import { NotificationsService } from './notifications.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    TwilioModule.forRoot({
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_SECURE == 'true',
        // tls: {
        //   ciphers: 'SSLv3',
        // },
        // requireTLS: true,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
  ],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
