import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/controllers/user.controller';
import { User } from 'src/entities/user.entity';
import { FileService } from 'src/services/file.service';
import { UserService } from 'src/services/user.service';
import { EmailModule } from './email.module';


@Module({
  imports: [TypeOrmModule.forFeature([User]), EmailModule],
  providers: [UserService, FileService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
