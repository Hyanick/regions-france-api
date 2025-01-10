// src/modules/region.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RegionService } from 'src/services/region.service';
import { RegionController } from 'src/controllers/region.controller';
import { Region } from 'src/entities/region.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Region])],
  providers: [RegionService],
  controllers: [RegionController],
})
export class RegionModule {}
