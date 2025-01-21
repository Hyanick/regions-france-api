import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { randomInt } from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class VerificationService {
  constructor(private readonly mailerService: MailerService) {}

  async generateVerificationCode(): Promise<string> {
    return randomInt(100000, 999999).toString(); // Génère un code à 6 chiffres
  }

  async sendEmail(email: string, code: string): Promise<void> {
    this.mailerService.addTransporter('transporter', {
      service: 'gmail', // gmail, outlook, ...
      host: 'smtp.gmail.com',
      port: '587',
      secure: false, // false pour TLS, true pour SSL
      auth: {
        user: 'yanick.yh@gmail.com',
        pass: 'uguc qjan igij zjik',
      },
    });

    await this.mailerService.sendMail({
      from: 'yanick.yh@gmail.com',
      to: email,
      subject: 'Vérification de votre compte',
      template: 'verification', // Nom du fichier template sans extension
      context: {
        code: code, // Remplissage des variables {{ code }} dans le template
      },
    });
  }

  /*async sendEmail(email: string, code: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // gmail, outlook, ...
      host: 'smtp.gmail.com',
      port: '587',
      secure: false, // false pour TLS, true pour SSL
      auth: {
        user: 'yanick.yh@gmail.com',
        pass: 'uguc qjan igij zjik',
      },
    });

    console.log('transporter', transporter);
    console.log('email', transporter);
    
    await transporter.sendMail({
      from: 'yanick.yh@gmail.com',
      to: email,
      subject: 'Vérification de votre compte',
      template: 'verification', // Nom du fichier template sans extension
      context: {
        code: code, // Remplissage des variables {{ code }} dans le template
      },
    });
  }
  */

  async sendSms(phoneNumber: string, code: string): Promise<void> {
    // Ex : Utilisation de Twilio
    const client = require('twilio')('TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN');
    await client.messages.create({
      body: `Your verification code is: ${code}`,
      from: 'YOUR_TWILIO_PHONE_NUMBER',
      to: phoneNumber,
    });
  }
}
