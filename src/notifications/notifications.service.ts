import { Injectable } from '@nestjs/common';
import { TwilioService } from 'nestjs-twilio';
import { MailerService } from '@nestjs-modules/mailer';

export interface SmsMessage {
  phone: string;
  message: string;
}

@Injectable()
export class NotificationsService {
  private readonly phoneSMS: string;

  public constructor(private readonly service: TwilioService, private readonly mailService: MailerService) {
    this.phoneSMS = process.env.SMS_PHONE_NUMBER;
    if (!this.phoneSMS) {
      throw new Error('Phone number for sending SMS is not set');
    }
  }

  async sendSMS({ phone, message }: SmsMessage) {
    return this.service.client.messages.create({
      body: message,
      from: this.phoneSMS,
      to: phone,
    });
  }

  async sendSimpleMail(to: string, subject: string, text: string) {
    return this.mailService.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
    });
  }
}
