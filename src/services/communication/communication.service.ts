import { Injectable, Scope } from '@nestjs/common';

import * as nodemailer from 'nodemailer';

import { LoggerService } from './../logger/logger.service';

interface GmailCredentials {
  user: string;
  pass: string;
}

interface CommunicationOptions {
  gmail: GmailCredentials;
}

const logger = new LoggerService('CommunicationService');

@Injectable({ scope: Scope.TRANSIENT })
export class CommunicationService {
  transporter;
  isTransportAvailable = false;

  constructor(options: CommunicationOptions) {
    if (options.gmail) {
      this.transporter = nodemailer.createTransport({ service: 'Gmail', auth: options.gmail });
      this.verify();
    }
  }

  sendMail(message): void {
    this.transporter.sendMail(message, (error, info) => {
      if (error) {
        logger.error(error);
      }
      logger.log(info);
    });
  }

  private verify(): void {
    this.transporter.verify(error => (error ? logger.error(error) : logger.log('Successfully connected')));
  }
}
