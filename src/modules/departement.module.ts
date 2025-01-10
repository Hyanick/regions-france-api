import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartementController } from 'src/controllers/departement.controller';
import { Departement } from 'src/entities/departement.entity';
import { DepartementService } from 'src/services/departement.service';

@Module({
  imports: [TypeOrmModule.forFeature([Departement])],
  providers: [DepartementService],
  controllers: [DepartementController],
})
export class DepartementModule {}
