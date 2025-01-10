// src/services/commune.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Commune } from 'src/entities/commune.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommuneService {
  constructor(
    @InjectRepository(Commune)
    private communeRepository: Repository<Commune>,
  ) {}

  async findAll(): Promise<Commune[]> {
    return this.communeRepository.find();
  }

  async findByDepartement(codeDepartement: string): Promise<Commune[]> {
    return this.communeRepository.find({ where: { codeDepartement } });
  }
}
