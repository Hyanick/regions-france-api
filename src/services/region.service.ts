// src/services/region.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Region } from 'src/entities/region.entity';
import { Repository } from 'typeorm';


@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region)
    private regionRepository: Repository<Region>,
  ) {}

  async findAll(): Promise<Region[]> {
    return this.regionRepository.find();
  }

  async findOne(code: string): Promise<Region> {
    return this.regionRepository.findOne({ where: { code } });
  }
}
