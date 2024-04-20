import { Injectable } from '@nestjs/common';
import { TwilioService } from 'nestjs-twilio';

export interface SmsMessage {
  phone: string;
  message: string;
}

@Injectable()
export class NotificationsService {
  private readonly phoneSMS: string;

  public constructor(private readonly service: TwilioService) {
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
}
