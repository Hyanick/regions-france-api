import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommuneController } from 'src/controllers/commune.controller';
import { Commune } from 'src/entities/commune.entity';
import { CommuneService } from 'src/services/commune.service';


@Module({
    imports: [TypeOrmModule.forFeature([Commune])],
    controllers: [CommuneController],
    providers: [CommuneService],
})
export class CommuneModule {}
