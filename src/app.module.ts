import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Commune } from './entities/commune.entity';
import { Departement } from './entities/departement.entity';
import { Region } from './entities/region.entity';
import { User } from './entities/user.entity';
import { CommuneModule } from './modules/commune.module';
import { DepartementModule } from './modules/departement.module';
import { RegionModule } from './modules/region.module';
import { UserModule } from './modules/user.module';
import { UploadFileDto } from './dtos/upload-file.dto';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // ou l'adresse de votre serveur DB
      port: 5432, // Port PostgreSQL
      username: 'postgres',
      password: 'postgres',
      database: 'regionsFrance',
      entities: [Region, Departement, Commune, User],
      synchronize: true,
    }),
    DepartementModule,
    CommuneModule,
    RegionModule,
    UserModule,
    UploadFileDto
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
