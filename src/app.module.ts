import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadFileDto } from './dtos/upload-file.dto';
import { Commune } from './entities/commune.entity';
import { Departement } from './entities/departement.entity';
import { Region } from './entities/region.entity';
import { User } from './entities/user.entity';
import { AuthModule } from './modules/auth.module';
import { CommuneModule } from './modules/commune.module';
import { DepartementModule } from './modules/departement.module';
import { RegionModule } from './modules/region.module';
import { UserModule } from './modules/user.module';
import { VerificationModule } from './modules/verification.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Rend ConfigModule disponible globalement
      envFilePath: '.env', // Chemin vers votre fichier .env
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // ou l'adresse de votre serveur DB
      port: 5432, // Port PostgreSQL
      username: 'postgres',
      password: 'postgres',
      database: 'regionsFrance',
      entities: [Region, Departement, Commune, User],
      synchronize: true, // À désactiver en production
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com', // ou votre fournisseur SMTP
        port: 587, // ou 465 pour SSL
        secure: false, // Utilisez true si vous utilisez SSL
        auth: {
          user: 'yanick.yh@gmail.com',
          pass: 'uguc qjan igij zjik',
        },
      },
      defaults: {
        from: '"Votre Nom ou Service" <yanick.yh@gmail.com>', // Adresse par défaut pour les emails
      },
      template: {
        dir: join('C:', 'mon_dossier', 'templates'), // Dossier contenant vos templates
        adapter: new HandlebarsAdapter(), // Utiliser Handlebars pour les templates
        options: {
          strict: true,
        },
      },
    }),
    DepartementModule,
    CommuneModule,
    RegionModule,
    UserModule,
    UploadFileDto,
    AuthModule,
    VerificationModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
