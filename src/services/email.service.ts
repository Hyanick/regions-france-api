import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomInt } from 'crypto';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) {}

  async generateVerificationCode(): Promise<string> {
    return randomInt(100000, 999999).toString(); // Génère un code à 6 chiffres
  }

  async sendVerificationEmailByCode(email: string, code: string): Promise<void> {
    /* this.mailerService.addTransporter('transporter', {
      service: 'gmail', // gmail, outlook, ...
      host: 'smtp.gmail.com',
      port: '587',
      secure: false, // false pour TLS, true pour SSL
      auth: {
        user: 'yanick.yh@gmail.com',
        pass: 'uguc qjan igij zjik',
      },
    });
*/
    await this.mailerService.sendMail({
      // from: 'yanick.yh@gmail.com',
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

  async sendVerificationEmailByLink(email: string, userId: number): Promise<string> {
  //  console.log('email', email);
   // console.log('userId', userId);
    let verificationToken = '';
    const payload = { userId, email };

    try {
      // Générer un token de vérification
      verificationToken = this.jwtService.sign(
        payload,
        { secret: process.env.JWT_VERIFICATION_SECRET, expiresIn: '1h' }, // Clé secrète pour vérification
      );

      //console.log('verificationToken', verificationToken);

      // URL du lien de vérification (backend endpoint)
      const verificationLink = `${process.env.FRONTEND_URL}/verify-account?token=${verificationToken}`;

     

      console.log('Generated payload:', payload);


      console.log('Generated Token:', verificationToken);

     // console.log('verificationLink', verificationLink);
      /*
      this.mailerService.addTransporter('transporter', {
        service: 'gmail', // gmail, outlook, ...
        host: 'smtp.gmail.com',
        port: '587',
        secure: false, // false pour TLS, true pour SSL
        auth: {
          user: 'yanick.yh@gmail.com',
          pass: 'xvzw jdpk sopp wgxr',
        },
      });
*/
    /*  // Envoi de l'email

      console.log('Sending email with these parameters:', {
        to: email,
        subject: 'Verify Your Account',
        html: `<h1>Welcome!</h1>
               <p>Click the link below to verify your account:</p>
               <a href="${verificationLink}">Verify Account</a>`,
      });

      console.log('Sending email with context:', {
        verificationLink,
      });

      */
      if (verificationLink) {
        await this.mailerService.sendMail({
          to: email,
          subject: 'Vérification de votre compte',
          html: `<h1>Welcome!</h1>
          <p>Click the link below to verify your account:</p>
          <a href="${verificationLink}">Verify Account</a>`,
          /*  template: 'verification', // Nom du template utilisé
          context: { 
            // Exemple d'autres données dans le contexte
            verificationLink: verificationLink, // Doit être correctement défini
          },*/
        });
      }
    } catch (error) {
      throw new BadRequestException(
        "Impossible d'envoyer l'email de vérification",
      );
    }

    return verificationToken;
  }
}
